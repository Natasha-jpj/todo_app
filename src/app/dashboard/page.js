'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('form');

  const API_URL = 'http://127.0.0.1:8000/api/tasks';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, due_date: dueDate };
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage(editingId ? 'Task updated' : 'Task added');
      resetForm();
      fetchTasks();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.due_date?.split('T')[0]);
    setEditingId(task.id);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-pink-50 via-teal-100 to-white text-gray-800">     
<nav className="bg-blue-950 text-white px-6 py-3 shadow flex justify-between items-center">
          <h1 className="font-bold text-lg">📝 Task Tracker</h1>
        <div className="flex gap-4 text-sm">
          <button onClick={() => setActiveTab('form')} className={`hover:underline ${activeTab === 'form' ? 'font-bold' : ''}`}>Form</button>
          <button onClick={() => setActiveTab('tasks')} className={`hover:underline ${activeTab === 'tasks' ? 'font-bold' : ''}`}>Tasks</button>
          <button onClick={handleLogout} className="bg-white text-purple-600 px-3 py-1 rounded shadow">Logout</button>
        </div>
      </nav>

  <div className="w-full max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-12">
        {/* Form Section */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              {editingId ? 'Update Task' : 'Add New Task'}
            </h2>

            {message && <p className="bg-green-100 text-green-700 p-2 rounded text-center">{message}</p>}

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="text"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <div className="flex gap-4 justify-end">
              {editingId ? (
                <>
                  <button type="submit" className="bg-yellow-500 px-4 py-2 text-white rounded">Update</button>
                  <button type="button" className="bg-gray-500 px-4 py-2 text-white rounded" onClick={resetForm}>Cancel</button>
                </>
              ) : (
<button type="submit" className="bg-blue-950 px-6 py-2 text-white rounded">Add Task</button>              )}
            </div>
          </form>
        )}

        {/* Task List Section */}
        {activeTab === 'tasks' && (
          <>
            <h3 className="text-lg font-bold mb-2">Your Tasks</h3>
            <ul className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks yet.</p>
              ) : (
                tasks.map(task => (
                  <li key={task.id} className="flex justify-between items-center p-3 border rounded bg-teal-50">
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      {task.due_date && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleStatus(task)} className="text-sm px-2 py-1 bg-indigo-500 text-white rounded">
                        {task.completed ? 'Mark Pending' : 'Complete'}
                      </button>
                      <button onClick={() => handleEdit(task)} className="text-sm px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => handleDelete(task.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}