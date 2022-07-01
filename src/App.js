import './App.css';
import Home from './components/page/Home';
import About from './components/page/About';
import Beranda from './components/page/Beranda';
import Pelanggan from './components/page/Pelanggan';
import PelangganDetail from './components/page/Pelanggan/detail';
import Produk from './components/page/Produk';
import Penjualan from './components/page/Penjualan';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
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
      </Routes>
    </div>
  );
}

export default App;
