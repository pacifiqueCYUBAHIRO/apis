const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

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

// Handle form submission
app.post("/add-user", (req, res) => {
  const { name, email } = req.body;

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err) => {
    if (err) {
      res.send("<h2>Error inserting user</h2>");
    } else {
      res.send(`
        <h2>User Added Successfully!</h2>
        <a href="/">Go Back</a>
      `);
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});