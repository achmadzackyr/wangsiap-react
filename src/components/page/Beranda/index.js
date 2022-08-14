import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import axios from 'axios';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useToken from '../../hooks/useToken';
import Login from '../Login';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Accordion, Image } from 'react-bootstrap';
//import io from 'socket.io-client';

//const socket = io('127.0.0.1:8000');

const Beranda = () => {
  let navigate = useNavigate();

  const { token, setToken } = useToken();
  const [loading, setLoading] = useState(false);
  const [sessionFound, setSessionFound] = useState(false);
  const [koneksi, setKoneksi] = useState({});
  const [qr, setQr] = useState('');
  const [hp, setHp] = useState('');
  const [showQrButton, setShowQrButton] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState(60);
  //const [isConnected, setIsConnected] = useState(socket.connected);

  // if (!token) {
  //   return <Login setToken={setToken} />;
  // }

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     console.log('konak');
  //     setIsConnected(true);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('dikonak');
  //     setIsConnected(false);
  //   });

  //   socket.on('connection.update', (data) => {
  //     console.log('dataQR', data);
  //     //setQr(data.data);
  //   });

  //   return () => {
  //     socket.off('connect');
  //     socket.off('disconnect');
  //     socket.off('connection.update');
  //   };
  // }, []);

  const DeleteSession = async (hpReq) => {
    axios({
      method: 'delete',
      url: `https://wagw.wangsiap.com/sessions/delete/${hpReq}`,
      headers: {}
    })
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      });
  };

  const RemakeSession = async () => {
    axios({
      method: 'delete',
      url: `https://wagw.wangsiap.com/sessions/delete/${hp}`,
      headers: {}
    })
      .then(function (response) {
        CreateSession();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const CreateSession = async () => {
    axios({
      method: 'post',
      url: 'https://wagw.wangsiap.com/sessions/add',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        id: hp,
        isLegacy: 'false'
      })
    })
      .then(function (response) {
        if (response.data.success && 'qr' in response.data.data) {
          setQr(response.data.data.qr);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.status == 409) {
          RemakeSession();
        }
      })
      .finally(() => {
        setShowQrButton(false);
        setShowCountdown(true);

        let y = 59;
        const x = setInterval(() => {
          y--;
          setCount(y);
          if (y <= 0) {
            clearInterval(x);
            setShowCountdown(false);
            setShowQrButton(true);
            setQr('');
          }
        }, 1000);
      });
  };

  useEffect(() => {
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
        const hpRes = response.data.data.hp;
        //const hpRes = '6285223670378';
        setHp(hpRes);
        axios({
          method: 'get',
          url: `https://wagw.wangsiap.com/sessions/status/${hpRes}`,
          headers: {}
        })
          .then(function (response) {
            setKoneksi(response.data.data);
            setSessionFound(true);
            if (response.data.data.status == 'connected') {
              DeleteSession(hpRes);
              setShowQrButton(true);
            }
          })
          .catch(function (error) {
            if (error.response.status == 404) {
              setSessionFound(false);
            }
            setShowQrButton(true);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.reload();
          navigate('../login', {
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
  }, []);

  return (
    <PrivateLayout title="Beranda" active="Beranda" loading={loading}>
      <Row>
        <Col md={4} sm={12}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Status Koneksi</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col>
                    {sessionFound ? (
                      koneksi.status == 'authenticated' ? (
                        <b>Tersambung</b>
                      ) : (
                        <b>Tidak Tersambung</b>
                      )
                    ) : (
                      <b>Belum Tersambung</b>
                    )}
                    <br />
                    {showCountdown && <span className="fs-4 mt-3 mb-1">Lakukan Scan! {count}</span>}
                    {showQrButton && (
                      <div className="d-grid">
                        <Button
                          variant="wangsiap-primary"
                          onClick={() => {
                            CreateSession();
                          }}
                        >
                          <b>Scan QR baru</b>
                        </Button>
                      </div>
                    )}
                    <Image className="w-100" src={qr}></Image>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col md={8} sm={12}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Grafik</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col>(Coming Soon)</Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </PrivateLayout>
  );
};

export default Beranda;
