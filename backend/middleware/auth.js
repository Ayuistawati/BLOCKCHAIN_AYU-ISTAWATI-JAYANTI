const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan atau tidak valid' });
  }

  const token = bearerHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Middleware opsional tambahan untuk peran tertentu
const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Akses ditolak: role tidak sesuai' });
  }
  next();
};

module.exports = { verifyToken, checkRole };
