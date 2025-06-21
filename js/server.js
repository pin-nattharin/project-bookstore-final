const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // ให้โหลด index.html ได้

const db = new sqlite3.Database('./data.db', (err) => {
  if (err) console.error('❌ DB Error:', err.message);
  else console.log('✅ Connected to SQLite DB');
});

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
