const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const loginRoute = require('./routes/login'); // สมมติว่าอยู่ใน routes/login.js

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));

// Middleware for sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,    // true ถ้าใช้ HTTPS
    sameSite: 'lax'   // หรือ 'none' ถ้าเป็น secure
  }
}));

app.get('/romance', (req, res) => {
  res.sendFile(path.join(__dirname, 'romance.html'));
});

app.get('/lifestyle', (req, res) => {
  res.sendFile(path.join(__dirname, 'lifestyle.html'));
});

app.get('/recipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'recipe.html'));
});

const CART_FILE = path.join(__dirname, 'data/cart.json'); // กำหนด path ให้ชัดเจน


// Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));

// Use routes for books
const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

// Use routes for users
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

// Use routes for cart
const cartRoutes = require('./routes/cart');
app.use('/api', cartRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Starting the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
