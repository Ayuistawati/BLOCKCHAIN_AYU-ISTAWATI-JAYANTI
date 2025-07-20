const crypto = require('crypto');
const fs = require('fs');
const fabricService = require('../services/fabricService');
const uploadFileToIPFS = require('../services/pinataService');

const uploadCertificate = async (req, res) => {
  try {
    const { nim, nama, kegiatan, tanggal } = req.body;
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const cid = await uploadFileToIPFS(filePath);
    const role = req.user.role;

    const certificate = {
      hash,
      nim,
      nama,
      kegiatan,
      tanggal,
      cid,
      role,
      valid: false
    };

    await fabricService.createCertificate(hash, role, certificate);

    res.json({ message: '✅ Sertifikat berhasil diunggah', hash, cid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Gagal mengunggah sertifikat' });
  }
};

const validateCertificate = async (req, res) => {
  try {
    const { hash } = req.body;
    const allCerts = await fabricService.getAllCertificates();

    const hasMahasiswa = allCerts.some(c => c.hash === hash && c.role === 'mahasiswa');
    const hasPanitia = allCerts.some(c => c.hash === hash && c.role === 'panitia');

    if (hasMahasiswa && hasPanitia) {
      await fabricService.updateValidationStatus(hash);
      return res.json({ message: '✅ Sertifikat valid', hash, valid: true });
    }

    res.json({ message: '❌ Sertifikat tidak valid', hash, valid: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Gagal melakukan validasi sertifikat' });
  }
};

const getCertificatesByUser = async (req, res) => {
  try {
    const nim = req.user.nim;
    const certs = await fabricService.getCertificatesByUser(nim);
    res.json(certs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Gagal mengambil sertifikat' });
  }
};

const getAllCertificates = async (req, res) => {
  try {
    const certs = await fabricService.getAllCertificates();
    const mahasiswaCerts = certs.filter(cert => cert.role === 'mahasiswa');
    res.json(mahasiswaCerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Gagal mengambil semua sertifikat' });
  }
};

module.exports = {
  uploadCertificate,
  validateCertificate,
  getCertificatesByUser,
  getAllCertificates
};
