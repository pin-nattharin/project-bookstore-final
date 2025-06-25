const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/user.json');

// โหลด user จากไฟล์ JSON
function loadUsers() {
  if (!fs.existsSync(dataFile)) return [];
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
}

router.post('/', (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt with username: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Read error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
        
    const users = loadUsers(); // โหลดจาก JSON
    const user = users.find(u => u.email === email && u.password === password);

     if (!user) {
      return res.status(400).json({ success: false, message: 'Incorrected Username' });
    }

    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Incorrected Password' });
    }

    
    // Store user in session
    req.session.user = { 
      id : user.id,
      email: user.email, 
      role: user.role };
    
    return res.json({ 
      success: true,
      message: 'Login successfully',
      user: req.session.user
    });
  });
});

module.exports = router;