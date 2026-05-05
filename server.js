const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// GET ALL MENU ITEMS
// =====================
app.get("/menu", (req, res) => {
  const sql = "SELECT * FROM menu";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

// =====================
// ADD MENU ITEM (ADMIN)
// =====================
app.post("/menu", (req, res) => {
  const { name, price, description, image } = req.body;

  const sql = "INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, description, image], (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: "Menu added successfully" });
  });
});

// =====================
// DELETE MENU ITEM
// =====================
app.delete("/menu/:id", (req, res) => {
  const sql = "DELETE FROM menu WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: "Deleted successfully" });
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});