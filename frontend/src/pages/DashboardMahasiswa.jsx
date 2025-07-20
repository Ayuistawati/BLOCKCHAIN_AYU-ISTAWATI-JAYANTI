import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const DashboardMahasiswa = () => {
  const [certificates, setCertificates] = useState([]);
  const [file, setFile] = useState(null);
  const [kegiatan, setKegiatan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setNama(user.nama);
      setNim(user.nim);
    }
    getCertificates();
  }, []);

  const getCertificates = async () => {
    try {
      const res = await axios.get('/api/certificate/my-certificates', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCertificates(res.data);
    } catch (err) {
      console.error('Gagal ambil sertifikat:', err);
      setCertificates([]);
    }
  };

  const handleUpload = async () => {
    if (!file || !kegiatan || !tanggal || !nim || !nama) {
      alert('Lengkapi semua field!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('kegiatan', kegiatan);
    formData.append('tanggal', tanggal);
    formData.append('nim', nim);     // ✅ dibutuhkan backend
    formData.append('nama', nama);   // ✅ dibutuhkan backend

    try {
      const res = await axios.post('/api/certificate/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Upload berhasil! Hash: ' + res.data.hash);
      setFile(null);
      setKegiatan('');
      setTanggal('');
      getCertificates(); // refresh daftar
    } catch (err) {
      console.error('Upload gagal:', err);
      alert('Upload gagal!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🎓 Dashboard Mahasiswa</h2>

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Nama Kegiatan"
            value={kegiatan}
            onChange={(e) => setKegiatan(e.target.value)}
            style={styles.input}
          />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            style={styles.input}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={styles.input}
          />
          <button onClick={handleUpload} style={styles.button}>
            Upload Sertifikat
          </button>
        </div>

        <h3 style={{ marginTop: '30px' }}>📄 Sertifikat Saya</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Kegiatan</th>
              <th>Tanggal</th>
              <th>Status Validasi</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length > 0 ? (
              certificates.map((cert, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{cert.kegiatan}</td>
                  <td>{cert.tanggal}</td>
                  <td style={{ color: cert.valid ? 'green' : 'red', fontWeight: 'bold' }}>
                    {cert.valid ? '✅ Valid' : '❌ Tidak Valid'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  Belum ada sertifikat yang diunggah
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #1e3c72, #2a5298)',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '60px',
    paddingBottom: '60px'
  },
  box: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '800px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '12px',
    backgroundColor: '#c62828',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  }
};

export default DashboardMahasiswa;
