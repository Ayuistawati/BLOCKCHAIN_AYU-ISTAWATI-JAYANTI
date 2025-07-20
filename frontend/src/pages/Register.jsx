import { useState } from 'react';
import axios from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ nim: '', nama: '', password: '', role: 'mahasiswa' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', form);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleRegister}>
        <h2 style={styles.title}>📝 Registrasi Akun</h2>
        <input
          name="nim"
          type="text"
          placeholder="NIM"
          value={form.nim}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="nama"
          type="text"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="panitia">Panitia</option>
          <option value="validator">Validator</option>
        </select>
        <button type="submit" style={styles.button}>Daftar</button>
        <p style={styles.text}>
          Sudah punya akun?{' '}
          <Link to="/" style={styles.link}>Login di sini</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #1e3c72, #2a5298)',
  },
  form: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  title: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: '20px'
  },
  input: {
    margin: '10px 0',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    backgroundColor: '#c62828',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  text: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px'
  },
  link: {
    color: '#1e3c72',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default Register;
