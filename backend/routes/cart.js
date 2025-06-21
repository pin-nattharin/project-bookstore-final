const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const CART_FILE = path.join(__dirname, '../data/carts.json');

// อ่านตะกร้าทั้งหมด
function readCart() {
  if (!fs.existsSync(CART_FILE)) return {};
  return JSON.parse(fs.readFileSync(CART_FILE));
}

// เขียนตะกร้าทั้งหมด
function writeCart(data) {
  fs.writeFileSync(CART_FILE, JSON.stringify(data, null, 2));
}

// ✅ เพิ่มสินค้าเข้าตะกร้า พร้อมเช็คว่า login หรือยัง
router.post('/add', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please login first.' });
  }

  const userId = req.session.user.id;
  const { productId, quantity } = req.body;

  const carts = readCart();

  if (!carts[userId]) {
    carts[userId] = [];
  }

  carts[userId].push({ productId, quantity });

  writeCart(carts);
  res.json({ message: 'Added to cart successfully!' });
});

module.exports = router;
