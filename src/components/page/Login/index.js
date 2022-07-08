import React, { useState, useEffect } from 'react';
import { Container, Form, Image, Button } from 'react-bootstrap';
import wangsiaplogo from '../../../imgs/wangsiap-logo-dark.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as kon from '../../../constants';
import * as qs from 'qs';
import Loading from '../../molecule/Loading';
import Notif from '../../molecule/Notif';
import useToken from '../../hooks/useToken';
import useProfile from '../../hooks/useProfile';

function Login() {
  const location = useLocation();
  let navigate = useNavigate();

  const { token, setToken } = useToken();
  const { profile, setProfile } = useProfile();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState(location.state ? location.state.msg : '');
  const [notifVariant, setNotifVariant] = useState(
    location.state ? location.state.variant : 'success'
  );

  useEffect(() => {
    if (token) {
      navigate('../beranda', { replace: true });
    }
    if (location.state) {
      setShowNotif(true);
    }
  }, []);

  const doLogin = (e) => {
    setLoading(true);
    var data = qs.stringify({
      email: email,
      password: password
    });
    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/auth/login`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios
      .get(`${kon.API_URL}/sanctum/csrf-cookie`)
      .then((response) => {
        axios(config)
          .then(function (response) {
            setToken(response.data.data.token);
            setProfile(response.data.data);
            setNotifMsg('Berhasil Login!');
            setNotifVariant('success');
            navigate('../beranda', { replace: true });
          })
          .catch(function (error) {
            console.log('err', error);
            setNotifMsg('Periksa Kembali Email dan Password!');
            setNotifVariant('danger');
          });
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
              doLogin(e);
            }}
          >
            <Image
              alt="logo"
              src={wangsiaplogo}
              width="150"
              height="50"
              className="d-inline-block align-top"
            />
            <h1 className="h3 mb-3 fw-normal">Silahkan masuk</h1>
            <Form.Group className="form-floating" controlId="floatingInput">
              <Form.Control
                type="email"
                required
                placeholder="Masukkan Email"
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

            <div className="mb-3 text-start">
              <Link to="/lupa-password" style={{ fontSize: '0.8rem' }}>
                Lupa Password?
              </Link>
            </div>
            <Button className="w-100" variant="wangsiap-primary" type="submit">
              Masuk
            </Button>
            <p className="mt-2 text-muted">
              Belum terdaftar? <Link to="/daftar">Daftar!</Link>
            </p>
          </Form>
        </main>
        <p className="mt-5 mb-3 text-muted">Wangsiap.com &copy; 2022</p>
      </Container>
      {showNotif && (
        <Notif variant={notifVariant} show={showNotif} setShow={setShowNotif} isLogin={true}>
          {notifMsg}
        </Notif>
      )}
    </div>
  );
}

export default Login;
