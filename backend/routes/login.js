const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFile = path.join(__dirname, '../data/user.json');

router.post('/', (req, res) => {
  const { loginUsername, loginPassword } = req.body;
  console.log(`Login attempt with username: ${loginUsername}`);

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Read error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
        
    const users = JSON.parse(data);

    const user = users.find(u => u.email === loginUsername);

     if (!user) {
      return res.status(400).json({ success: false, message: 'Incorrected Username' });
    }

    if (user.password !== loginPassword) {
      return res.status(400).json({ success: false, message: 'Incorrected Password' });
    }
    


    return res.json({ 
      success: true,
      message: 'Login successfully',
      user: { email: user.email}
    });
  });
});

module.exports = router;