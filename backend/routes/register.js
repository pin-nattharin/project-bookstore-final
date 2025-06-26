const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/user.json');

function loadUsers() {
  if (!fs.existsSync(dataFile)) return [];
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
}

function saveUsers(users) {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

router.post('/', (req, res) => {
  const { registerUsername, registerPassword, registerRole } = req.body;
  console.log('Received registration data:', req.body);

    if (!registerUsername || !registerPassword) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = loadUsers();
  if (users.find(u => u.email === registerUsername)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  saveUsers(users);

    const newUser = {
      email: registerUsername,
      password: registerPassword,
      role: registerRole
    };
    users.push(newUser);

    fs.writeFile(dataFile, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).json({ message: 'Failed to save user' });
      }
      return res.json({ message: 'Register successfully' });
    });
  });

module.exports = router;