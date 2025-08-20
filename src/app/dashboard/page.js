"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos || []);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTodo = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setTodos((prev) => [...prev, data.todo]);
      setForm({ title: "", description: "", status: "pending" });
    }
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo Dashboard</h1>
        <button onClick={logout} className="bg-gray-800 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      {/* Add Todo */}
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full mb-2"
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Todo
      </button>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos.map((todo, index) => {
          if (!todo || !todo.title) return null;
          return (
            <li key={todo._id || index} className="border p-2 rounded">
              <h2 className="font-bold">{todo.title}</h2>
              <p>{todo.description}</p>
              <p>Status: {todo.status}</p>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                🗑 Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}