import React, { useState, useEffect } from 'react';
import { Container, Form, Image, Button, FloatingLabel } from 'react-bootstrap';
import wangsiaplogo from '../../../imgs/wangsiap-logo-dark.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as kon from '../../../constants';
import * as qs from 'qs';
import { useNavigate } from 'react-router-dom';
import Loading from '../../molecule/Loading';
import Notif from '../../molecule/Notif';
import useToken from '../../hooks/useToken';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';

function Daftar() {
  const { token, setToken } = useToken();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifVariant, setNotifVariant] = useState('success');
  const [origins, setOrigins] = useState([]);
  const [from, setFrom] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('../beranda', { replace: true });
    }
    loadOrigin();
  }, []);

  const loadOrigin = () => {
    setLoading(true);
    var data = qs.stringify({});
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/gateway/get-origin`,
      headers: {},
      data: data
    };

    axios(config)
      .then(function (response) {
        setOrigins(response.data.detail);
      })
      .catch(function (error) {
        console.log(error);
        setNotifMsg('Gagal Memuat Data Kota, Silahkan Muat Ulang');
        setNotifVariant('danger');
        setShowNotif(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const doRegister = (e) => {
    setLoading(true);
    var data = qs.stringify({
      email: email,
      password: password,
      nama: nama,
      hp: hp,
      from: from
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/auth/register`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        navigate('../login', {
          replace: true,
          state: { msg: 'Berhasil Daftar!', variant: 'success' }
        });
      })
      .catch(function (error) {
        if (error.response.data.message.email != null) {
          setNotifMsg(error.response.data.message.email[0]);
        } else if (error.response.data.message.password != null) {
          setNotifMsg(error.response.data.message.password[0]);
        } else if (error.response.data.message.from != null) {
          setNotifMsg('Pilih Kota Asal Pengiriman!');
        } else {
          setNotifMsg(error.response.data.message);
        }
        setNotifVariant('danger');
      })
      .finally(() => {
        setLoading(false);
        setShowNotif(true);
      });
    e.preventDefault();
  };
  return (
    <div className="bg-light text-center vh-100">
      <Loading loading={loading} />
      <Container className="vh-100">
        <main className="form-signin w-100 m-auto pt-5">
          <Form
            onSubmit={(e) => {
              doRegister(e);
            }}
          >
            <Image
              alt="logo"
              src={wangsiaplogo}
              width="150"
              height="50"
              className="d-inline-block align-top"
            />
            <h1 className="h3 mb-3 fw-normal">Silahkan daftar</h1>
            <Form.Group className="form-floating" controlId="namaInput">
              <Form.Control
                type="text"
                placeholder="Masukkan Nama"
                required
                onChange={(e) => setNama(e.target.value)}
              />
              <Form.Label>Nama</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating" controlId="hpInput">
              <Form.Control
                type="text"
                placeholder="Masukkan No.HP"
                required
                onChange={(e) => setHp(e.target.value)}
              />
              <Form.Label>No. Hp</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating" controlId="floatingInput">
              <Form.Control
                type="email"
                placeholder="Masukkan Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Label>Email</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating" controlId="floatingPassword">
              <Form.Control
                type="password"
                required
                placeholder="Masukkan Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Label>Password</Form.Label>
            </Form.Group>
            <Typeahead
              id="origin-autocomplete"
              labelKey={(option) => `${option.City_Name}`}
              onChange={(selected) => {
                selected.length > 0 ? setFrom(selected[0].City_Code) : setFrom('');
              }}
              options={origins}
              placeholder="Kota asal pengiriman"
              renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                return (
                  <Hint>
                    <FloatingLabel
                      controlId="floatingLabel"
                      label="Kota Asal Pengiriman"
                      className="w-100"
                    >
                      <Form.Control
                        required
                        {...inputProps}
                        ref={(node) => {
                          inputRef(node);
                          referenceElementRef(node);
                        }}
                      />
                    </FloatingLabel>
                  </Hint>
                );
              }}
            />
            <div className="my-3"></div>
            <Button className="w-100" variant="wangsiap-primary" type="submit">
              Daftar
            </Button>
            <p className="mt-2 text-muted">
              Sudah terdaftar? <Link to="/login">Login!</Link>
            </p>
          </Form>
        </main>
        <p className="mt-4 mb-3 text-muted">Wangsiap.com &copy; 2022</p>
      </Container>
      {showNotif && (
        <Notif variant={notifVariant} show={showNotif} setShow={setShowNotif} isLogin={true}>
          {notifMsg}
        </Notif>
      )}
    </div>
  );
}

export default Daftar;
