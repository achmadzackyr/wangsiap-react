import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useProfile from '../../hooks/useProfile';
import useToken from '../../hooks/useToken';
import Notif from '../../molecule/Notif';
import { useNavigate, useParams } from 'react-router-dom';
import CommaValidation from '../../helpers/CommaValidation';

const DetailProduk = () => {
  let navigate = useNavigate();
  const { skuParam } = useParams();

  const { profile, setProfile } = useProfile();
  const { token, setToken } = useToken();

  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifVariant, setNotifVariant] = useState('success');

  const [sku, setSku] = useState(skuParam ? skuParam : '');
  const [id, setId] = useState('');
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [berat, setBerat] = useState('');
  const [lebar, setLebar] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [panjang, setPanjang] = useState('');
  const [volume, setVolume] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pecahBelah, setPecahBelah] = useState(0);

  const panjangChange = (e) => {
    setPanjang(e.target.value);
    calculateVolume(e.target.value, lebar, tinggi);
  };

  const lebarChange = (e) => {
    setLebar(e.target.value);
    calculateVolume(panjang, e.target.value, tinggi);
  };

  const tinggiChange = (e) => {
    setTinggi(e.target.value);
    calculateVolume(panjang, lebar, e.target.value);
  };

  const beratChange = (e) => {
    setBerat(e.target.value);
  };

  const calculateVolume = (panjang, lebar, tinggi) => {
    let v = (panjang * lebar * tinggi) / 6000;
    setVolume(v.toFixed(2));
  };

  useEffect(() => {
    setLoading(true);
    var data = qs.stringify({
      sku: sku
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/products/getBySku`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        const x = response.data.data;
        setId(x.id || '');
        setNama(x.nama || '');
        setHarga(x.harga || '');
        setBerat(x.berat || '');
        setLebar(x.lebar || '');
        setTinggi(x.tinggi || '');
        setPanjang(x.panjang || '');
        calculateVolume(x.panjang || '', x.lebar || '', x.tinggi || '');
        setDeskripsi(x.deskripsi || '');
        setPecahBelah(x.pecah_belah);
      })
      .catch(function (error) {
        setNotifMsg(error.response.data.message);
        setNotifVariant('danger');
        setShowNotif(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editProduct = (e) => {
    setLoading(true);
    var data = qs.stringify({
      sku: sku,
      nama: nama,
      deskripsi: deskripsi,
      harga: CommaValidation(harga),
      berat: CommaValidation(berat),
      lebar: CommaValidation(lebar),
      tinggi: CommaValidation(tinggi),
      panjang: CommaValidation(panjang),
      pecah_belah: pecahBelah,
      aktif: '1',
      _method: 'PUT'
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/products/${id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        navigate('../produk', {
          replace: true,
          state: { msg: 'Berhasil Mengubah Produk', variant: 'success' }
        });
      })
      .catch(function (error) {
        setNotifMsg(error.response.data.message);
        setNotifVariant('danger');
      })
      .finally(() => {
        setLoading(false);
        setShowNotif(true);
      });
    e.preventDefault();
  };

  return (
    <PrivateLayout
      title="Edit Produk"
      active="Produk"
      loading={loading}
      prevs={[{ text: 'Produk', link: '/produk' }]}
    >
      <Form
        className="mb-5"
        onSubmit={(e) => {
          editProduct(e);
        }}
      >
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNama">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan nama produk"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formSku">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan sku produk"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHarga">
              <Form.Label>Harga</Form.Label>
              <InputGroup>
                <InputGroup.Text id="harga-icon">Rp</InputGroup.Text>
                <Form.Control
                  required
                  type="number"
                  placeholder="Masukkan harga produk"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  aria-describedby="harga-icon"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formDeskripsi">
              <Form.Label>Deskripsi isi paket</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  placeholder="Contoh: sepatu bola anak / tas wanita"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formPanjang">
              <Form.Label>Panjang</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="number"
                  placeholder="Masukkan panjang produk"
                  value={panjang}
                  onChange={(e) => panjangChange(e)}
                  aria-describedby="panjang-icon"
                />
                <InputGroup.Text id="panjang-icon">cm</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formLebar">
              <Form.Label>Lebar</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="number"
                  placeholder="Masukkan lebar produk"
                  value={lebar}
                  onChange={(e) => lebarChange(e)}
                  aria-describedby="lebar-icon"
                />
                <InputGroup.Text id="lebar-icon">cm</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formTinggi">
              <Form.Label>Tinggi</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="number"
                  placeholder="Masukkan tinggi produk"
                  value={tinggi}
                  onChange={(e) => tinggiChange(e)}
                  aria-describedby="tinggi-icon"
                />
                <InputGroup.Text id="tinggi-icon">cm</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formVolume">
              <Form.Label>Volume ke Berat</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="number"
                  value={volume}
                  aria-describedby="volume-icon"
                  readOnly
                />
                <InputGroup.Text id="volume-icon">kg</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formBerat">
              <Form.Label>Berat</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="number"
                  placeholder="Masukkan berat produk"
                  value={berat}
                  onChange={(e) => beratChange(e)}
                  aria-describedby="berat-icon"
                />
                <InputGroup.Text id="berat-icon">kg</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formPecahBelah">
              <Form.Label>Barang Pecah Belah?</Form.Label>
              <Form.Select
                aria-label="Pecah Belah"
                value={pecahBelah}
                onChange={(e) => setPecahBelah(e.target.value)}
              >
                <option value="0">Bukan Pecah Belah</option>
                <option value="1">Barang Pecah Belah</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button size="sm" variant="wangsiap-primary" type="submit">
          Simpan
        </Button>
        <Button size="sm" variant="secondary" href={`/produk`} className="ms-1">
          Kembali
        </Button>
      </Form>
      {showNotif && (
        <Notif variant={notifVariant} show={showNotif} setShow={setShowNotif}>
          {notifMsg}
        </Notif>
      )}
    </PrivateLayout>
  );
};

export default DetailProduk;
