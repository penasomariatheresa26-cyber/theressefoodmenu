import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Theresse Food Menu API running...");
});

// GET MENU
app.get("/menu", (req, res) => {
  db.query("SELECT * FROM menu", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// ADD MENU
app.post("/menu", (req, res) => {
  const { name, price, description, image } = req.body;

  const sql =
    "INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, price, description, image], (err) => {
    if (err) return res.json(err);
    res.json({ message: "Added successfully" });
  });
});

// DELETE MENU
app.delete("/menu/:id", (req, res) => {
  db.query("DELETE FROM menu WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json(err);
    res.json({ message: "Deleted" });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
