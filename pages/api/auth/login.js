import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { email, password } = req.body;
  const client = await clientPromise;
  const db = client.db("todo_app");
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: user.email, name: user.name }, "secret123", { expiresIn: "1h" });
  res.status(200).json({ token });
}