const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS)
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// GET users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    } else {
      res.json(results);
    }
  });
});

// CREATE user
app.post("/add-user", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send("<h2>Name and Email are required</h2>");
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err) => {
    if (err) {
      console.error("Error inserting user:", err);
      res.status(500).send("<h2>Error inserting user</h2>");
    } else {
      res.send(`
        <h2>User Added Successfully!</h2>
        <a href="/">Go Back</a>
      `);
    }
  });
});

// UPDATE user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(sql, [name, email, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Failed to update user" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ message: "User updated successfully" });
    }
  });
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Failed to delete user" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});