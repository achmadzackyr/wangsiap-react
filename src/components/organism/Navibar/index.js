import React, { useState } from 'react';
import { Navbar, Container, Image, Nav, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as kon from '../../../constants';
import axios from 'axios';
import wangsiaplogo from '../../../imgs/wangsiap-logo-light.png';
import useToken from '../../hooks/useToken';
import useProfile from '../../hooks/useProfile';
import Loading from '../../molecule/Loading';

const Navibar = ({ active }) => {
  const { profile, setProfile } = useProfile();

  const { token, setToken } = useToken();
  const [logoutShow, setLogoutShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogout = () => {
    setLogoutShow(false);
    setLoading(true);
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/auth/logout`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios(config)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        localStorage.clear();
        window.location.reload();
      });
  };

  return (
    <>
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
              <Nav.Link className={active === 'Pengaturan' && 'active'} href="/pengaturan">
                Pengaturan
              </Nav.Link>
              <hr />
              <Nav.Link className={active === 'Akun' && 'active'} href="/akun">
                Akun
              </Nav.Link>
              <Nav.Link className={active === 'Pengiriman' && 'active'} href="/pengiriman">
                Pengiriman
              </Nav.Link>
              <Nav.Link className={active === 'Pembayaran' && 'active'} href="/pembayaran">
                Pembayaran
              </Nav.Link>
              <hr />
              <Navbar.Text className="ms-3">{profile?.nama}</Navbar.Text>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button onClick={() => setLogoutShow(true)} className="logout-button">
                Keluar
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Loading loading={loading} />
      <Modal
        size="sm"
        show={logoutShow}
        onHide={() => setLogoutShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">Yakin akan keluar?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            <Button variant="danger" onClick={() => doLogout()}>
              Keluar
            </Button>
            <Button className="btn-wangsiap-primary" onClick={() => setLogoutShow(false)}>
              Batal
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navibar;
