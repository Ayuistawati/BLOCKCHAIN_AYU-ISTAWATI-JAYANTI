const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const certificateController = require('../controllers/certificateController');
const { verifyToken, checkRole } = require('../middleware/auth'); // ✅ pastikan checkRole terimport

// ✅ Rute unggah sertifikat (mahasiswa & panitia)
router.post(
  '/upload',
  verifyToken,
  upload.single('file'),
  certificateController.uploadCertificate
);

// ✅ Validator: Validasi sertifikat
router.post(
  '/validate',
  verifyToken,
  checkRole('validator'), // 🔐 hanya validator yang bisa validasi
  certificateController.validateCertificate
);

// ✅ Mahasiswa: lihat sertifikat sendiri
router.get(
  '/my-certificates',
  verifyToken,
  checkRole('mahasiswa'), // opsional: pastikan hanya mahasiswa bisa lihat miliknya
  certificateController.getCertificatesByUser
);

// ✅ Validator: lihat semua sertifikat mahasiswa
router.get(
  '/all-certificates',
  verifyToken,
  checkRole('validator'), // 🔐 hanya validator bisa lihat semua
  certificateController.getAllCertificates
);

module.exports = router;
