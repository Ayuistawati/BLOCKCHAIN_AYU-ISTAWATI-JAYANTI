import { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const DashboardValidator = () => {
  const [certificates, setCertificates] = useState([]);

  const getAllCertificates = async () => {
    try {
      const res = await axios.get('/api/certificate/all-certificates', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCertificates(res.data);
    } catch (err) {
      console.error('Gagal mengambil sertifikat:', err);
      setCertificates([]);
    }
  };

  const handleValidate = async (hash) => {
    try {
      const res = await axios.post(
        '/api/certificate/validate',
        { hash },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      alert(res.data.message);
      getAllCertificates(); // Refresh daftar sertifikat setelah validasi
    } catch (err) {
      console.error('Gagal validasi:', err);
      alert('❌ Gagal validasi!');
    }
  };

  useEffect(() => {
    getAllCertificates();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>✅ Dashboard Validator</h2>

        <h3 style={{ marginTop: '20px' }}>📄 Daftar Sertifikat Mahasiswa</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Kegiatan</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length > 0 ? (
              certificates.map((cert, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{cert.nama}</td>
                  <td>{cert.kegiatan}</td>
                  <td>{cert.tanggal}</td>
                  <td style={{ color: cert.valid ? 'green' : 'red', fontWeight: 'bold' }}>
                    {cert.valid ? '✅ Valid' : '❌ Belum Valid'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleValidate(cert.hash)}
                      disabled={cert.valid}
                      style={{
                        backgroundColor: cert.valid ? '#ccc' : '#388e3c',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: cert.valid ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cek Hash
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Tidak ada data sertifikat
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
    maxWidth: '1000px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#1565c0',
    textAlign: 'center',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  }
};

export default DashboardValidator;
