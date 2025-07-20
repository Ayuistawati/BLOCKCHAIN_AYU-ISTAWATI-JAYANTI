import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardPanitia';
import DashboardMahasiswa from './pages/DashboardMahasiswa';
import DashboardValidator from './pages/DashboardValidator';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-mahasiswa" element={<DashboardMahasiswa />} />
        <Route path="/dashboard-validator" element={<DashboardValidator />} />
      </Routes>
    </Router>
  );
};
export default App;
