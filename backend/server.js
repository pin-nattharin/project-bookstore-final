const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.get('/romance', (req, res) => {
  res.sendFile(path.join(__dirname, './romance.html'));
});


app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));

// ใช้ routes
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});