const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// เปิดการเชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./webtechAssignment2.db');

// 1. GET - ค้นหาผู้ใช้โดย id
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// 2. GET - ค้นหาผู้ใช้โดย email
router.get('/email/:email', (req, res) => {
  const email = req.params.email;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// 3. POST - เพิ่มผู้ใช้ใหม่
router.post('/', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.run(query, [email, password], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, email });
  });
});

// 4. PUT - อัปเดตข้อมูลผู้ใช้
router.put('/:id', (req, res) => {
  const { email, password } = req.body;
  const userId = req.params.id;
  const query = 'UPDATE users SET email = ?, password = ? WHERE id = ?';
  db.run(query, [email, password, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// 5. DELETE - ลบผู้ใช้
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  db.run(query, [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

module.exports = router;
