import { useState } from 'react';
import axios from '../axiosConfig';

const DashboardPanitia = () => {
  const [file, setFile] = useState(null);
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [tanggal, setTanggal] = useState('');

  const handleUpload = async () => {
    if (!file || !nim || !nama || !kegiatan || !tanggal) {
      alert('Lengkapi semua field!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nim', nim);
    formData.append('nama', nama);
    formData.append('kegiatan', kegiatan);
    formData.append('tanggal', tanggal);

    try {
      const res = await axios.post('/api/certificate/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('✅ Upload berhasil! Hash: ' + res.data.hash);
      setFile(null);
      setNim('');
      setNama('');
      setKegiatan('');
      setTanggal('');
    } catch (err) {
      console.error('Upload gagal:', err);
      alert('❌ Upload gagal!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>📥 Upload Sertifikat Mahasiswa</h2>

        <div style={styles.form}>
          <input
            type="text"
            placeholder="NIM Mahasiswa"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Nama Mahasiswa"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            style={styles.input}
          />
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
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
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
    maxWidth: '600px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#1565c0',
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '10px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '12px',
    backgroundColor: '#1565c0',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default DashboardPanitia;
