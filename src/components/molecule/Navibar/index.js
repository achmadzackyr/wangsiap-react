import React from 'react';
import { Navbar, Container, Image, Nav } from 'react-bootstrap';
import wangsiaplogo from '../../../imgs/wangsiap-logo-light.png';
import { Link } from 'react-router-dom';

const Navibar = ({ active }) => {
  return (
    <Navbar bg="wangsiap-primary" variant="dark" expand="md" style={{ zIndex: 6 }}>
      <Container fluid>
        <Link to="/beranda">
          <Navbar.Brand>
            <Image
              alt="logo"
              src={wangsiaplogo}
              width="150"
              height="50"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-nav" />
        <Navbar.Collapse id="responsive-nav">
          <Nav className="me-auto d-md-none">
            <Nav.Link className={active === 'Beranda' && 'active'} href="/beranda">
              Beranda
            </Nav.Link>
            <Nav.Link className={active === 'Penjualan' && 'active'} href="/penjualan">
              Penjualan
            </Nav.Link>
            <Nav.Link className={active === 'Produk' && 'active'} href="/produk">
              Produk
            </Nav.Link>
            <Nav.Link className={active === 'Pelanggan' && 'active'} href="/pelanggan">
              Pelanggan
            </Nav.Link>
            <Nav.Link className={active === 'Laporan' && 'active'} href="/laporan">
              Laporan
            </Nav.Link>
            <Nav.Link className={active === 'Akun' && 'active'} href="/akun">
              Akun
            </Nav.Link>
            <Nav.Link className={active === 'Pengiriman' && 'active'} href="/pengiriman">
              Pengiriman
            </Nav.Link>
            <Nav.Link className={active === 'Pembayaran' && 'active'} href="/pembayaran">
              Pembayaran
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navibar;
