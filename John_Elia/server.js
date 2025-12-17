const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("courses.db");

db.run(`CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  instructor TEXT,
  price REAL
)`);

app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/api/courses", (req, res) => {
  const { title, instructor, price } = req.body;
  db.run(
    "INSERT INTO courses(title, instructor, price) VALUES(?,?,?)",
    [title, instructor, price],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/courses/:id", (req, res) => {
  db.run("DELETE FROM courses WHERE id=?", req.params.id, () => {
    res.json({ message: "Deleted" });
  });
});

app.listen(4000, () =>
  console.log("Server running at http://localhost:4000")
);