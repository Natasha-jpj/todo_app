import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("todo_app");
  const todos = db.collection("todos");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let decoded;
  try {
    decoded = jwt.verify(token, "secret123");
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userEmail = decoded.email;

  if (req.method === "GET") {
    const userTodos = await todos.find({ user: userEmail }).toArray();
    res.status(200).json({ todos: userTodos });
  } else if (req.method === "POST") {
    const { title, description, status } = req.body;
    const result = await todos.insertOne({
      title,
      description,
      status,
      user: userEmail,
      createdAt: new Date(),
    });
    const newTodo = await todos.findOne({ _id: result.insertedId });
    res.status(201).json({ todo: newTodo });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}