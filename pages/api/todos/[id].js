import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("todo_app");
  const todos = db.collection("todos");

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    jwt.verify(token, "secret123");
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (req.method === "DELETE") {
    try {
      await todos.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ message: "Failed to delete todo" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}