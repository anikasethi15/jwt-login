import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "mysecretkey123"; // normally stored in .env

// Dummy user
const user = {
  email: "test@example.com",
  password: "123456",
};

// Login Route (generate token)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === user.email && password === user.password) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected Route
app.get("/api/dashboard", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Welcome ${decoded.email}! You accessed a protected route.` });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
