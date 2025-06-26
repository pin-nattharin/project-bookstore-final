// const express = require('express');
// const fs = require('fs');
// const router = express.Router();
// const path = require('path');

// const CART_FILE = path.join(__dirname, '../data/carts.json');

// // อ่านตะกร้าทั้งหมด
// function readCart() {
//   if (!fs.existsSync(CART_FILE)) return {};
//   return JSON.parse(fs.readFileSync(CART_FILE));
// }

// // เขียนตะกร้าทั้งหมด
// function writeCart(data) {
//   fs.writeFileSync(CART_FILE, JSON.stringify(data, null, 2));
// }

// // ✅ เพิ่มสินค้าเข้าตะกร้า พร้อมเช็คว่า login หรือยัง
// router.post('/add', (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: 'Please login first.' });
//   }

//   const userId = req.session.user.id;
//   const { productId, quantity } = req.body;

//   const carts = readCart();

//   if (!carts[userId]) {
//     carts[userId] = [];
//   }

//   carts[userId].push({ productId, quantity });

//   writeCart(carts);
//   res.json({ message: 'Added to cart successfully!' });
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// เปิดการเชื่อมต่อกับฐานข้อมูล
const db = new sqlite3.Database('./webtechAssignment2.db');

// สร้างตาราง cart ถ้ายังไม่มี
db.run(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    book_id INTEGER,
    quantity INTEGER
  )
`);


// 1. GET - ค้นหาตะกร้าของผู้ใช้โดย user_email
router.get('/cart', (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ message: 'Not logged in' });

  const sql = `
    SELECT c.id, c.quantity, b.name, b.price
    FROM cart c
    JOIN books b ON c.book_id = b.id
    WHERE c.user_email = ?
  `;

  db.all(sql, [user.email], (err, rows) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ cart: rows });
  });
});


// 2. GET - ค้นหาตะกร้าจาก cart_id
router.get('/cart/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  db.get('SELECT * FROM cart WHERE id = ?', [cartId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  });
});

// 3. POST - เพิ่มสินค้าในตะกร้า
router.post('/cart', (req, res) => {
  
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login first' });
  }
  const user_email = req.session.user.email;
  const { book_id, quantity } = req.body;

  //const { user_email, book_id, quantity } = req.body;
  const query = 'INSERT INTO cart (user_email, book_id, quantity) VALUES (?, ?, ?)';
  db.run(query, [user_email, book_id, quantity], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Added to cart', id: this.lastID, user_email, book_id, quantity });
  });
});

// 4. PUT - อัปเดตจำนวนสินค้าภายในตะกร้า
router.put('/cart/:cart_id', (req, res) => {
  const { quantity } = req.body;
  const cartId = req.params.cart_id;
  const query = 'UPDATE cart SET quantity = ? WHERE id = ?';
  db.run(query, [quantity, cartId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'Cart updated successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  });
});

// 5. DELETE - ลบสินค้าจากตะกร้า
router.delete('/cart/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  const query = 'DELETE FROM cart WHERE id = ?';
  db.run(query, [cartId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'Cart item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  });
});

// DELETE - ล้างตะกร้าทั้งหมดของผู้ใช้ (ใช้ตอนจ่ายเงินเสร็จ)
router.delete('/cart/all', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login first' });
  }
  const user_email = req.session.user.email;
  const query = 'DELETE FROM cart WHERE user_email = ?';
  db.run(query, [user_email], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'All cart items deleted' });
  });
});



module.exports = router;
