import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import * as kon from '../../../constants';
import * as qs from 'qs';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import Notif from '../../molecule/Notif';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import useProfile from '../../hooks/useProfile';
import useToken from '../../hooks/useToken';

function Pengaturan() {
  const { profile, setProfile } = useProfile();
  const { token, setToken } = useToken();
  const [loading, setLoading] = useState(false);
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifVariant, setNotifVariant] = useState('success');
  const [origins, setOrigins] = useState([]);

  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [nama, setNama] = useState('');
  const [from, setFrom] = useState('');
  const [selectedFrom, setSelectedFrom] = useState([]);
  const [gender, setGender] = useState(0);
  const [jneId, setJneId] = useState('');
  const [jneIdCod, setJneIdCod] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kodepos, setKodepos] = useState('');
  const [penanganan, setPenanganan] = useState(0);

  useEffect(() => {
    currentUser();
  }, []);

  const currentUser = () => {
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
        const x = response.data.data;
        setId(x.id);
        setEmail(x.email);
        setHp(x.hp);
        setNama(x.nama);
        setGender(x.gender ? x.gender : 0);
        setJneId(x.jne_id ? x.jne_id : '');
        setJneIdCod(x.jne_id_cod ? x.jne_id_cod : '');
        setAlamat(x.alamat ? x.alamat : '');
        setKecamatan(x.kecamatan ? x.kecamatan : '');
        setKota(x.kota ? x.kota : '');
        setProvinsi(x.provinsi ? x.provinsi : '');
        setKodepos(x.kodepos ? x.kodepos : '');
        setFrom(x.from ? x.from : '');

        var datax = qs.stringify({});
        var configx = {
          method: 'post',
          url: `${kon.API_URL}/api/gateway/get-origin`,
          headers: {},
          data: datax
        };

        axios(configx)
          .then(function (response) {
            setOrigins(response.data.detail);
            setSelectedFrom(response.data.detail.filter((v) => v.City_Code == x.from));
          })
          .catch(function (error) {
            setNotifMsg('Gagal Memuat Data Kota, Silahkan Muat Ulang');
            setNotifVariant('danger');
            setShowNotif(true);
          });
      })
      .catch(function (error) {
        console.log(error);
        setNotifMsg('Gagal Memuat Data Pengguna');
        setNotifVariant('danger');
        setShowNotif(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateUser = (e) => {
    if (from === '') {
      setNotifMsg('Harap Memilih Kota Asal Pengiriman');
      setNotifVariant('danger');
      setShowNotif(true);
      e.preventDefault();
      return false;
    }

    setLoading(true);
    var data = qs.stringify({
      email: email,
      hp: hp,
      nama: nama,
      gender: gender,
      jne_id: jneId,
      jne_id_cod: jneIdCod,
      alamat: alamat,
      kecamatan: kecamatan,
      kota: kota,
      provinsi: provinsi,
      kodepos: kodepos,
      from: from,
      _method: 'PUT'
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/users/${id}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setProfile(response.data.data);
        setNotifMsg('Data Pengguna Berhasil Diubah');
        setNotifVariant('success');
        window.location.reload();
      })
      .catch(function (error) {
        //console.log(error.response.data.data);
        setNotifMsg('Gagal Mengubah Data Pengguna');
        setNotifVariant('danger');
      })
      .finally(() => {
        setLoading(false);
        setShowNotif(true);
      });
    e.preventDefault();
  };

  return (
    <PrivateLayout title="Pengaturan" active="Pengaturan" loading={loading}>
      <Form
        className="myform mb-5"
        onSubmit={(e) => {
          updateUser(e);
        }}
      >
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="required">Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" readOnly value={email} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHp">
              <Form.Label className="required">HP</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="08123456...."
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNama">
              <Form.Label className="required">Nama</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formHp">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select
                aria-label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="0">Laki-laki</option>
                <option value="1">Perempuan</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formJneId">
              <Form.Label>JNE Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan JNE ID"
                value={jneId}
                onChange={(e) => setJneId(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formJneIdCod">
              <Form.Label>JNE Id COD</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan JNE ID untuk COD"
                value={jneIdCod}
                onChange={(e) => setJneIdCod(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formJneId">
              <Form.Label>
                Biaya Penanganan COD <small>(sesuai perjanjian dengan JNE)</small>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  step="0.1"
                  placeholder="Biaya penanganan cod"
                  value={penanganan}
                  onChange={(e) => setPenanganan(e.target.value)}
                  aria-describedby="harga-icon"
                />
                <InputGroup.Text id="harga-icon">%</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <AsyncTypeahead
              id="origin-autocomplete"
              isLoading={loadingOrigin}
              onSearch={() => {}}
              labelKey={(option) => `${option.City_Name}`}
              onChange={(selected) => {
                selected.length > 0 ? setFrom(selected[0].City_Code) : setFrom('');
                setSelectedFrom(selected);
              }}
              options={origins}
              selected={selectedFrom}
              placeholder="Pilih kota asal pengiriman"
              renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                return (
                  <Form.Group className="mb-3" controlId="formFrom">
                    <Form.Label className="required">Kota Asal Pengiriman</Form.Label>
                    <Form.Control
                      required
                      {...inputProps}
                      ref={(node) => {
                        inputRef(node);
                        referenceElementRef(node);
                      }}
                    />
                  </Form.Group>
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formAlamat">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Masukkan Alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formKecamatan">
              <Form.Label>Kecamatan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Kecamatan"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formKota">
              <Form.Label>Kabupaten / Kota</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Kota"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formProvinsi">
              <Form.Label>Provinsi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Provinsi"
                value={provinsi}
                onChange={(e) => setProvinsi(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formKodepos">
              <Form.Label>Kodepos</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Masukkan Kodepos"
                value={kodepos}
                onChange={(e) => setKodepos(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="wangsiap-primary" type="submit">
          Simpan
        </Button>
      </Form>
      {showNotif && (
        <Notif variant={notifVariant} show={showNotif} setShow={setShowNotif}>
          {notifMsg}
        </Notif>
      )}
    </PrivateLayout>
  );
}

export default Pengaturan;
