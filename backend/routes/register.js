const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const userFilePath = path.join(__dirname, '../data/user.json');

router.post('/', (req, res) => {
  const { registerUsername, registerPassword } = req.body;
  console.log('Received registration data:', req.body);

    if (!registerUsername || !registerPassword) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }

    const existingUser  = users.find(user => user.email === registerUsername);
    if (existingUser) {
      return res.status(400).json({ message: 'This email has already been used.' });
    }

    const newUser = {
      email: registerUsername,
      password: registerPassword
    };
    users.push(newUser);

    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).json({ message: 'Failed to save user' });
      }
      return res.json({ message: 'Register successfully' });
    });
  });
});

module.exports = router;