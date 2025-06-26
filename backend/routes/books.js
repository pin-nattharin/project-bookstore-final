const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// ตั้งค่าเก็บไฟล์รูปที่ /uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './images/');
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// เปิดการเชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./webtechAssignment2.db');
db.serialize(); //ทำงานทีละคำสั่ง

// ตารางสินค้า (สร้างถ้ายังไม่มี)
db.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price REAL,
  image TEXT,
  category TEXT
)`);

//0.getall
router.get('/getall', (req, res) => {
  //const bookId = req.params.id;
  db.all('SELECT * FROM books',(err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    else {
      res.json(rows);
  };
});
});

// 1. GET - ค้นหาหนังสือโดย id
router.get('/:id', (req, res) => {
  const bookId = req.params.id;
  db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});

// 2. GET - ค้นหาหนังสือโดย category
router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  db.all('SELECT * FROM books WHERE category = ?', [category], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 3. GET - ค้นหาหนังสือโดย name
router.get('/name/:name', (req, res) => {
  const name = req.params.name;
  db.all('SELECT * FROM books WHERE name LIKE ?', [`%${name}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 4. POST - เพิ่มหนังสือใหม่
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, category } = req.body;
  const image = req.file ? req.file.filename : '';

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const query = 'INSERT INTO books (name, price, image, category) VALUES (?, ?, ?, ?)';
  db.run(query, [name, price, image, category], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, price, image, category });
  });
});

// 5. PUT - อัปเดตข้อมูลหนังสือ
router.put('/:id', upload.single('image'), (req, res) => {
  const { name, price, category } = req.body;
  const bookId = req.params.id;
  const image = req.file ? req.file.filename : null;

  // ถ้ามีรูปใหม่ อัปเดตรูปด้วย
  const query = image
    ? 'UPDATE books SET name = ?, price = ?, image = ?, category = ? WHERE id = ?'
    : 'UPDATE books SET name = ?, price = ?, category = ? WHERE id = ?';

  const params = image
    ? [name, price, image, category, bookId]
    : [name, price, category, bookId];

  db.run( query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'Book updated successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});

// 6. DELETE - ลบหนังสือ
router.delete('/:id', (req, res) => {
  const bookId = req.params.id;
  const query = 'DELETE FROM books WHERE id = ?';
  db.run(query, [bookId], function(err) {
    if (err) {
      console.error('DB Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
});

module.exports = router;
