import './App.css';
import { useEffect } from 'react';
import Home from './components/page/Home';
import About from './components/page/About';
import Beranda from './components/page/Beranda';
import Pelanggan from './components/page/Pelanggan';
import PelangganDetail from './components/page/Pelanggan/detail';
import Produk from './components/page/Produk';
import Penjualan from './components/page/Penjualan';
import Pengaturan from './components/page/Pengaturan';
import Daftar from './components/page/Daftar';
import Login from './components/page/Login';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import useToken from './components/hooks/useToken';
import { useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigate();
  const { token, setToken } = useToken();

  useEffect(() => {
    if (!token) {
      navigate('../login', { replace: true });
    }
  }, []);

  return (
    <div className="App">
      <Routes basename={process.env.PUBLIC_URL}>
        <Route index path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="beranda" element={<Beranda />} />
        <Route path="pelanggan" element={<Pelanggan />} />
        <Route path="pelanggan/:pelangganId" element={<PelangganDetail />} />
        <Route path="produk" element={<Produk />} />
        <Route path="penjualan" element={<Penjualan />} />
        <Route path="pengaturan" element={<Pengaturan />} />
        <Route path="daftar" element={<Daftar />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
