const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'webtechAssignment2.db'); // __dirname คือ folder backend
const db = new sqlite3.Database(DB_PATH);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // ให้โหลด index.html ได้
app.use('/images', express.static(path.join(__dirname, 'images')));


db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT
  )
`);

app.get('/api/products', (req, res) => {
  const q = req.query.q || '';
  db.all("SELECT * FROM products WHERE name LIKE ?", [`%${q}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/cart', (req, res) => {
  const { productId } = req.body;
  console.log("🛒 Added product:", productId);
  res.json({ status: "success", productId });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.get('/api/products', (req, res) => {
  const q = req.query.q || '';
  const category = req.query.category || '';

  let sql = "SELECT * FROM products WHERE name LIKE ?";
  let params = [`%${q}%`];

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
