"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
    } else {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 border rounded w-96 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-500 cursor-pointer underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}