import { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const res = await axios.post('/api/users/login', { nim, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      switch (res.data.user.role) {
        case 'panitia':
          navigate('/dashboard-admin');
          break;
        case 'mahasiswa':
          navigate('/dashboard-mahasiswa');
          break;
        case 'validator':
          navigate('/dashboard-validator');
          break;
        default:
          alert('Role tidak dikenal');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={styles.title}>🔐 Login SKP</h2>
        <input
          type="text"
          placeholder="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.text}>
          Belum punya akun?{' '}
          <Link to="/register" style={styles.link}>Daftar sekarang</Link>
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
    background: 'linear-gradient(to right, #1e3c72, #2a5298)', // biru gradien
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
    color: '#c62828', // merah tua
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
    backgroundColor: '#c62828', // merah
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

export default Login;
