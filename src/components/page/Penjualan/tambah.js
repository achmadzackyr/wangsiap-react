import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Row, Col, Button, Form, Accordion } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useToken from '../../hooks/useToken';
import Notif from '../../molecule/Notif';
import { useNavigate } from 'react-router-dom';
import CommaValidation from '../../helpers/CommaValidation';

const TambahPenjualan = () => {
  let navigate = useNavigate();
  const { token, setToken } = useToken();

  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifVariant, setNotifVariant] = useState('success');

  const [sku, setSku] = useState('');
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kodepos, setKodepos] = useState('');
  const [pcs, setPcs] = useState(1);
  const [cod, setCod] = useState(1);
  const [myProducts, setMyProducts] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [chat, setChat] = useState('');
  const [profile, setProfile] = useState({});

  useEffect(() => {
    GetMyProducts();
    //GetPayments();
    GetProfile();
  }, []);

  useEffect(() => {
    let c = cod == 1 ? 'Y' : 'N';
    setChat(`#${nama}#${alamat}#${kodepos}#${hp}#${sku}#${pcs}#${c}`);
  }, [nama, alamat, kodepos, hp, sku, pcs, cod]);

  const GetPayments = () => {
    setLoading(true);
    var config = {
      method: 'get',
      url: `${kon.API_URL}/api/payments`,
      headers: {}
    };

    axios(config)
      .then(function (response) {
        setMyPayments(response.data.data.data);
      })
      .catch(function (error) {
        setNotifMsg(error.response.data.message);
        setNotifVariant('danger');
        setShowNotif(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetMyProducts = () => {
    setLoading(true);
    var data = qs.stringify({});
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/products/get-my-product`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setMyProducts(response.data.data.data);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.reload();
          navigate('../../login', {
            replace: true,
            state: { msg: 'Sesi Kadaluarsa, Silahkan Login Kembali!', variant: 'danger' }
          });
        } else {
          setNotifMsg(error.response.data.message);
          setNotifVariant('danger');
          setShowNotif(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetProfile = () => {
    setLoading(true);
    var config = {
      method: 'get',
      url: `${kon.API_URL}/api/auth/profile`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios(config)
      .then(function (response) {
        setProfile(response.data.data);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.reload();
          navigate('../../login', {
            replace: true,
            state: { msg: 'Sesi Kadaluarsa, Silahkan Login Kembali!', variant: 'danger' }
          });
        } else {
          alert(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addOrder = (e) => {
    setLoading(true);
    let hpParam = hp;

    if (hpParam.charAt(0) == '+') {
      hpParam = hpParam.substring(1);
    }

    if (hpParam.charAt(0) == '0') {
      hpParam = '62' + hpParam.substring(1);
    }

    var data = qs.stringify({
      message: chat,
      receiver: `${profile.hp}@c.us`,
      sender: `${hpParam}@c.us`,
      order_status_id: '2'
    });

    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/gateway/order`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        navigate('../penjualan', {
          replace: true,
          state: { msg: 'Berhasil Menambah Penjualan', variant: 'success' }
        });
      })
      .catch(function (error) {
        console.log(error);
        setNotifMsg(error.response.data.message);
        setNotifVariant('danger');
      })
      .finally(() => {
        setLoading(false);
        setShowNotif(true);
      });
    e.preventDefault();
  };

  const OnChangeChat = (e) => {
    setChat(e.target.value);

    let x = e.target.value.substring(1).split('#');
    setNama(x[0]);
    setAlamat(x[1]);
    setKodepos(x[2]);
    setHp(x[3]);
    setSku(x[4]);
    setPcs(x[5]);
    setCod(x[6] == 'Y' || x[6] == 'y' ? 1 : 2);
  };

  return (
    <PrivateLayout
      title="Tambah Penjualan"
      active="Penjualan"
      loading={loading}
      prevs={[{ text: 'Penjualan', link: '/penjualan' }]}
    >
      <Form
        className="mb-5"
        onSubmit={(e) => {
          addOrder(e);
        }}
      >
        <Row className="mb-3">
          <Col>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Via Chat Berformat</Accordion.Header>
                <Accordion.Body>
                  <Form.Group className="mb-3" controlId="formChat">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Masukkan chat pembeli yang sesuai format pemesanan"
                      value={chat}
                      onChange={(e) => OnChangeChat(e)}
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNama">
              <Form.Label>Nama Pembeli</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan nama pembeli"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHp">
              <Form.Label>No. HP Pembeli</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan no hp pembeli"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="formAlamat">
              <Form.Label>Alamat Lengkap</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Masukkan alamat lengkap pembeli"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formKodepos">
              <Form.Label>
                Kodepos{' '}
                <a href="https://wangsiap.com/kodepos" target={'_blank'} className="ms-2">
                  Cek Kodepos
                </a>
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan Kodepos"
                value={kodepos}
                onChange={(e) => setKodepos(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHp">
              <Form.Label>Apakah COD?</Form.Label>
              <Form.Select aria-label="COD" value={cod} onChange={(e) => setCod(e.target.value)}>
                <option value="0">Bukan COD</option>
                <option value="1">COD</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHp">
              <Form.Label>SKU Pesanan</Form.Label>
              <Form.Select aria-label="SKU" value={sku} onChange={(e) => setSku(e.target.value)}>
                <option value={''}>Pilih SKU produk</option>
                {myProducts.length > 0 ? (
                  myProducts.map((data, index) => (
                    <option value={data.sku} key={index}>
                      {data.sku} - {data.nama}
                    </option>
                  ))
                ) : (
                  <option value="0">Belum ada produk</option>
                )}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPcs">
              <Form.Label>Jumlah Pesanan</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Masukkan jumlah pesanan"
                value={pcs}
                onChange={(e) => setPcs(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="wangsiap-primary" type="submit">
              Tambah
            </Button>
          </Col>
        </Row>
      </Form>
      {showNotif && (
        <Notif variant={notifVariant} show={showNotif} setShow={setShowNotif}>
          {notifMsg}
        </Notif>
      )}
    </PrivateLayout>
  );
};

export default TambahPenjualan;
