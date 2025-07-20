const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// 🔒 Login menggunakan data user mock
router.post('/login', loginUser);

// 🧪 Optional: Endpoint register dummy (tidak menyimpan ke DB)
router.post('/register', registerUser);

// 🔐 Protected endpoint (cek token dan tampilkan user dari JWT)
router.get('/me', verifyToken, getProfile);

module.exports = router;
