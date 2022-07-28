import './App.css';
import { useEffect } from 'react';
import Home from './components/page/Home';
import About from './components/page/About';
import Beranda from './components/page/Beranda';
import Pelanggan from './components/page/Pelanggan';
import PelangganDetail from './components/page/Pelanggan/detail';
import Produk from './components/page/Produk';
import TambahProduk from './components/page/Produk/tambah';
import DetailProduk from './components/page/Produk/detail';
import Penjualan from './components/page/Penjualan';
import TambahPenjualan from './components/page/Penjualan/tambah';
import Pengaturan from './components/page/Pengaturan';
import Daftar from './components/page/Daftar';
import Login from './components/page/Login';
import Kodepos from './components/page/Kodepos';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import useToken from './components/hooks/useToken';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  let navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useToken();

  useEffect(() => {
    if (!token && location.pathname != '/kodepos' && location.pathname != '/') {
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
        <Route path="produk/tambah" element={<TambahProduk />} />
        <Route path="produk/:skuParam" element={<DetailProduk />} />
        <Route path="penjualan" element={<Penjualan />} />
        <Route path="penjualan/tambah" element={<TambahPenjualan />} />
        <Route path="pengaturan" element={<Pengaturan />} />
        <Route path="daftar" element={<Daftar />} />
        <Route path="login" element={<Login />} />
        <Route path="kodepos" element={<Kodepos />} />
      </Routes>
    </div>
  );
}

export default App;
