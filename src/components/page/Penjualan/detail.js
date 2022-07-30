import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useToken from '../../hooks/useToken';
import Notif from '../../molecule/Notif';
import { useNavigate, useParams } from 'react-router-dom';
import CommaValidation from '../../helpers/CommaValidation';

const DetailPenjualan = () => {
  let navigate = useNavigate();
  const { penjualanId } = useParams();
  const { token, setToken } = useToken();

  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifVariant, setNotifVariant] = useState('success');

  const [sku, setSku] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [profile, setProfile] = useState({});
  const [destination, setDestination] = useState({});

  //Order
  const [customerId, setCustomerId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [tanggalPesan, setTanggalPesan] = useState('');
  const [harga, setHarga] = useState(0);
  const [hargaProduk, setHargaProduk] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [berat, setBerat] = useState(0);
  const [beratProduk, setBeratProduk] = useState(0);
  const [from, setFrom] = useState('');
  const [thru, setThru] = useState('');
  const [pcs, setPcs] = useState(1);
  const [cod, setCod] = useState(1);

  //Customer
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kodepos, setKodepos] = useState('');

  useEffect(() => {
    GetMyProducts();
    //GetPayments();
    GetProfile();
    GetData();
  }, []);

  const GetData = () => {
    setLoading(true);
    var data = qs.stringify({
      order_id: penjualanId
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/orders/get-order-detail`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        const ord = response.data.data.order;
        const cus = response.data.data.customer;
        const orp = response.data.data.ordered_product;

        setTanggalPesan(ord.tanggal_pesan_string);
        setHarga(Math.round(ord.total_harga) + Math.round(ord.ongkir));
        setHargaProduk(Math.round(ord.total_harga) / Math.round(ord.total_pcs));
        setOngkir(ord.ongkir);
        setBerat(ord.total_berat);
        setBeratProduk(Math.round(ord.total_berat) / Math.round(ord.total_pcs));
        setPcs(ord.total_pcs);
        setFrom(ord.from);
        setThru(ord.thru);

        setCustomerId(cus.id);
        setStatusId(cus.customer_status_id);
        setNama(cus.nama);
        setHp(cus.hp);
        setAlamat(cus.alamat);
        setKodepos(cus.kodepos);

        //Sementara hanya 1 sku
        axios({
          method: 'get',
          url: `${kon.API_URL}/api/products/${orp[0].product_id}`,
          headers: {}
        })
          .then(function (response) {
            setSku(response.data.data.sku);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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

  const updateOrder = (e) => {
    setLoading(true);
    let hpParam = hp;

    if (hpParam.charAt(0) == '+') {
      hpParam = hpParam.substring(1);
    }

    if (hpParam.charAt(0) == '0') {
      hpParam = '62' + hpParam.substring(1);
    }

    var data = qs.stringify({});

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

  const CekOngkir = () => {
    setLoading(true);
    var data = qs.stringify({
      kodepos: kodepos
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/gateway/get-destinations-by-zip`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setDestination(response.data.data);
        axios({
          method: 'post',
          url: `${kon.API_URL}/api/gateway/get-tarif`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: qs.stringify({
            from: profile.from,
            thru: response.data.data[0].TARIFF_CODE,
            weight: berat
          })
        })
          .then(function (response) {
            const tariff = response.data.price.filter((x) => x.service_display === 'REG')[0];

            const totalOngkir = Math.round(tariff.price);
            setOngkir(totalOngkir);
            const totalHargaBaru = Math.round(harga) + totalOngkir;
            setHarga(totalHargaBaru);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onChangeSku = (e) => {
    setSku(e.target.value);
    let selected = myProducts.filter((x) => x.sku == e.target.value)[0];
    setHargaProduk(selected.harga);
    setBeratProduk(selected.berat);
    setHarga(Math.round(selected.harga) * pcs + Math.round(ongkir));
  };

  const onChangePcs = (e) => {
    setPcs(e.target.value);
    setHarga(Math.round(hargaProduk) * Math.round(e.target.value) + Math.round(ongkir));
    setBerat(Math.round(beratProduk) * Math.round(e.target.value));
  };

  return (
    <PrivateLayout
      title="Detail Penjualan"
      active="Penjualan"
      loading={loading}
      prevs={[{ text: 'Penjualan', link: '/penjualan' }]}
    >
      <Form
        className="mb-5"
        onSubmit={(e) => {
          updateOrder(e);
        }}
      >
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formTanggalPesan">
              <Form.Label>Tanggal Pesan</Form.Label>
              <Form.Control readOnly type="text" value={tanggalPesan} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                aria-label="Status"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
              >
                <option value="0">Pending</option>
                <option value="1">Diterima</option>
                <option value="5">Ditolak</option>
              </Form.Select>
            </Form.Group>
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
              <InputGroup className="mb-3">
                <Form.Control
                  required
                  type="text"
                  placeholder="Masukkan Kodepos"
                  value={kodepos}
                  onChange={(e) => setKodepos(e.target.value)}
                />
                <Button variant="outline-secondary" id="cek-ongkir" onClick={() => CekOngkir()}>
                  Cek Ongkir
                </Button>
              </InputGroup>
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
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formHp">
              <Form.Label>SKU Pesanan</Form.Label>
              <Form.Select aria-label="SKU" value={sku} onChange={(e) => onChangeSku(e)}>
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
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formPcs">
              <Form.Label>Jumlah Pesanan</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Masukkan jumlah pesanan"
                value={pcs}
                onChange={(e) => onChangePcs(e)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formTotalBerat">
              <Form.Label>Total Berat</Form.Label>
              <InputGroup>
                <Form.Control readOnly type="text" value={berat} />
                <InputGroup.Text id="berat-icon">Kg</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formHargaProduk">
              <Form.Label>Harga Produk</Form.Label>
              <InputGroup>
                <InputGroup.Text id="harga-icon">Rp</InputGroup.Text>
                <Form.Control
                  readOnly
                  type="text"
                  value={Number(Math.round(hargaProduk).toFixed(1)).toLocaleString('id-ID')}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formOngkir">
              <Form.Label>Ongkir</Form.Label>
              <InputGroup>
                <InputGroup.Text id="harga-icon">Rp</InputGroup.Text>
                <Form.Control
                  readOnly
                  type="text"
                  value={Number(Math.round(ongkir).toFixed(1)).toLocaleString('id-ID')}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formTotalHarga">
              <Form.Label>Total Harga (Rp)</Form.Label>
              <InputGroup>
                <InputGroup.Text id="harga-icon">Rp</InputGroup.Text>
                <Form.Control
                  readOnly
                  type="text"
                  value={Number(Math.round(harga).toFixed(1)).toLocaleString('id-ID')}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button size="sm" variant="wangsiap-primary" type="submit">
              Ubah
            </Button>
            <Button size="sm" variant="secondary" href={`/penjualan`} className="ms-1">
              Kembali
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

export default DetailPenjualan;
