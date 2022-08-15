import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import axios from 'axios';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useToken from '../../hooks/useToken';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Accordion, Image, Modal } from 'react-bootstrap';

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
  const [dcShow, setDcShow] = useState(false);

  const DeleteSession = async (hpReq) => {
    setLoading(true);
    setDcShow(false);
    axios({
      method: 'delete',
      url: `${kon.GATEWAY_URL}/sessions/delete/${hpReq}`,
      headers: {}
    })
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        CheckConnection(hpReq);
        setLoading(false);
      });
  };

  const RemakeSession = async () => {
    axios({
      method: 'delete',
      url: `${kon.GATEWAY_URL}/sessions/delete/${hp}`,
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
    setLoading(true);
    axios({
      method: 'post',
      url: `${kon.GATEWAY_URL}/sessions/add`,
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
        setLoading(false);

        let y = 59;
        const x = setInterval(() => {
          y--;
          setCount(y);
          if (y <= 0) {
            clearInterval(x);
            setShowCountdown(false);
            setShowQrButton(true);
            setQr('');
            CheckConnection(hp);
          } else {
            if (y % 10 === 0) {
              setLoading(true);
              axios({
                method: 'get',
                url: `${kon.GATEWAY_URL}/sessions/status/${hp}`,
                headers: {}
              })
                .then(function (response) {
                  if (response.data.data.status == 'authenticated') {
                    clearInterval(x);
                    setKoneksi(response.data.data);
                    setSessionFound(true);
                    setShowQrButton(false);
                    setShowCountdown(false);
                    setQr('');
                  }
                })
                .catch(function (error) {})
                .finally(() => {
                  setLoading(false);
                });
            }
          }
        }, 1000);
      });
  };

  const CheckConnection = (hpRes) => {
    axios({
      method: 'get',
      url: `${kon.GATEWAY_URL}/sessions/status/${hpRes}`,
      headers: {}
    })
      .then(function (response) {
        setKoneksi(response.data.data);
        setSessionFound(true);
        if (response.data.data.status == 'connected') {
          DeleteSession(hpRes);
          setShowQrButton(true);
        }
        if (response.data.data.status == 'authenticated') {
          setShowQrButton(false);
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
  };

  const CheckProfile = () => {
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
        CheckConnection(hpRes);
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
  };

  useEffect(() => {
    CheckProfile();
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
                    {showQrButton ? (
                      <div className="d-grid mt-3">
                        <Button
                          variant="wangsiap-primary"
                          onClick={() => {
                            CreateSession();
                          }}
                        >
                          <b>Scan QR baru</b>
                        </Button>
                      </div>
                    ) : (
                      <div className="d-grid mt-3">
                        <Button
                          variant="danger"
                          onClick={() => {
                            setDcShow(true);
                          }}
                        >
                          <b>Putuskan Sambungan</b>
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
      <Modal
        size="sm"
        show={dcShow}
        onHide={() => setDcShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">Yakin akan memutuskan?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            <Button variant="danger" onClick={() => DeleteSession(hp)}>
              Putuskan
            </Button>
            <Button className="btn-wangsiap-primary" onClick={() => setDcShow(false)}>
              Batal
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </PrivateLayout>
  );
};

export default Beranda;
