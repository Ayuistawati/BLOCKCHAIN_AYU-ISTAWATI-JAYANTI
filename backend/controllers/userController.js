const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUserToFabric, getUserFromFabric } = require('../services/fabricService');

// ✅ REGISTER USER — simpan ke blockchain
const registerUser = async (req, res) => {
  const { nim, nama, password, role } = req.body;

  if (!nim || !nama || !password || !role) {
    return res.status(400).json({ message: 'Lengkapi semua field' });
  }

  try {
    // Cek apakah user sudah ada di blockchain
    try {
      const existing = await getUserFromFabric(nim);
      if (existing) {
        return res.status(400).json({ message: 'User sudah terdaftar' });
      }
    } catch (err) {
      // OK jika user belum ditemukan
    }

    const hashed = await bcrypt.hash(password, 10);
    const userData = { nim, nama, role, password: hashed };

    await registerUserToFabric(nim, userData);

    const token = jwt.sign({ nim, nama, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'User berhasil didaftarkan',
      token,
      user: { nim, nama, role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN USER — ambil user dari blockchain
const loginUser = async (req, res) => {
  const { nim, password } = req.body;

  try {
    const user = await getUserFromFabric(nim);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { nim: user.nim, nama: user.nama, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PROFIL USER — hasil dari token JWT
const getProfile = (req, res) => {
  res.json(req.user);
};

module.exports = { loginUser, registerUser, getProfile };
