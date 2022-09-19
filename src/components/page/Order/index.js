import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, InputGroup, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useToken from '../../hooks/useToken';
import Notif from '../../molecule/Notif';
import wangsiaplogo from '../../../imgs/wangsiap-40px.png';
import '../../../../src/checkout.css';

const Order = () => {
  const { username } = useParams();
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

  const addSku = () => {};

  useEffect(() => {
    GetMyProducts();
    //GetPayments();
    GetProfile();
  }, []);

  return (
    <div style={{ backgroundColor: '#eef1f3' }}>
      <Container>
        <div className="app-wrapper app-wrapper-single">
          <div className="app-header">
            <h4 className="text-center mb-3">Form Checkout Order</h4>
          </div>
          <div>
            <Form
              className="mb-5"
              onSubmit={(e) => {
                addOrder(e);
              }}
            >
              <Container fluid className="checkout-body">
                <Row>
                  <Col className="checkout-body__form checkout-body__form-single">
                    <div className="contact-information">
                      <div class="contact-information-header section-title">
                        <span>Data Pesanan:</span>
                      </div>
                      <Row>
                        <Col xs={6} md={7}>
                          <Form.Label>SKU</Form.Label>
                        </Col>
                        <Col xs={6} md={5}>
                          <Form.Label>Jumlah</Form.Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6} md={7}>
                          <Form.Group className="mb-3" controlId="formHp">
                            <Form.Select
                              aria-label="SKU"
                              value={sku}
                              onChange={(e) => setSku(e.target.value)}
                            >
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
                        <Col xs={6} md={5}>
                          <Form.Group className="mb-3" controlId="formPcs">
                            <InputGroup className="input-number-controls">
                              <Button
                                variant="outline-secondary"
                                id="btn-sub-qty"
                                onClick={() => setPcs(pcs > 0 ? pcs - 1 : pcs)}
                              >
                                -
                              </Button>
                              <Form.Control
                                required
                                type="number"
                                placeholder="0"
                                value={pcs}
                                min={0}
                                max={9999}
                                onChange={(e) => setPcs(e.target.value)}
                                className="text-center"
                              />
                              <Button
                                variant="outline-secondary"
                                id="btn-add-qty"
                                onClick={() => setPcs(pcs + 1)}
                              >
                                +
                              </Button>
                              <Button
                                variant="danger"
                                style={{ backgroundColor: '#dc3545' }}
                                id="btn-add-qty"
                                onClick={() => setPcs(pcs + 1)}
                              >
                                X
                              </Button>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        {/* <Col xs={1}>
                          <Button variant="danger">X</Button>
                        </Col> */}
                      </Row>
                      <Button variant="wangsiap-primary" onClick={() => addSku()}>
                        Tambah
                      </Button>
                    </div>
                    <div className="contact-information">
                      <div class="contact-information-header section-title">
                        <span>Data Penerima:</span>
                      </div>
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

                      <Form.Group className="mb-3" controlId="formHp">
                        <Form.Label>Apakah COD?</Form.Label>
                        <Form.Select
                          aria-label="COD"
                          value={cod}
                          onChange={(e) => setCod(e.target.value)}
                        >
                          <option value="0">Bukan COD</option>
                          <option value="1">COD</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formHp">
                        <Form.Label>SKU Pesanan</Form.Label>
                        <Form.Select
                          aria-label="SKU"
                          value={sku}
                          onChange={(e) => setSku(e.target.value)}
                        >
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
                    </div>
                    <Button variant="wangsiap-primary" type="submit">
                      Checkout
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Form>
          </div>
          <div className="app-footer">
            <div className="footer-title">Powered by Wangsiap.com</div>
            <div class="footer-copyright">Copyright © 2022</div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Order;
