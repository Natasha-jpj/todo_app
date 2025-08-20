import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("todo_app");
    const users = db.collection("users");

    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      _id: new ObjectId(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered", userId: result.insertedId });
  } catch (err) {
  console.error("Registration error:", err); // 👈 Add this line
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
}
