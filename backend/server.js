const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Middleware for sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.get('/romance', (req, res) => {
  res.sendFile(path.join(__dirname, './romance.html'));
});

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
app.use('/api/cart', cartRoutes);

// Starting the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
