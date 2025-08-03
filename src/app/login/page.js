'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Mock login logic
    localStorage.setItem('auth_token', 'demo_token');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className=" font-semibold text-gray-700">📝 Task Tracker</h1>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-950 hover:bg-blue-700 text-white py-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="mt-4 text-gray-600 text-center text-sm">
          Don’t have an account?{' '}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}