import React from 'react';
import { Button, Row, Col, Container, Image } from 'react-bootstrap';
import PublicLayout from '../../layout/public';
import heroimg from '../../../imgs/hero.png';
import crmimg from '../../../imgs/crm-img.png';
import botimg from '../../../imgs/bot-img.png';
import integratorimg from '../../../imgs/integrator-img.png';
import validasiimg from '../../../imgs/validasi-img.png';

const Home = () => {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: '#F5F6FC' }}>
        <Container>
          <Row className="align-items-center pt-4">
            <Col md={6} sm={12}>
              <Row>
                <Col>
                  <h1 style={{ color: '#205072' }}>Integrator Bisnis Online</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Tingkatkan <b>Produktifitas</b> Tim CS Kamu dengan <b>Otomatisasi</b> Resi dari
                    WA secara Instant. <b>Tanpa Ribet</b> Entry Kiriman Lagi.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button href="/daftar" variant="wangsiap-primary">
                    Daftar Sekarang
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6} sm={12}>
              <Image alt="hero" src={heroimg} width="80%" />
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#EEF6F4 ' }}>
        <Container>
          <Row className="align-items-center pt-4">
            <Col md={6} sm={12}>
              <Image alt="hero" src={crmimg} width="80%" />
            </Col>
            <Col md={6} sm={12}>
              <Row>
                <Col>
                  <h1 style={{ color: '#205072' }}>Customer Relationship Management (CRM)</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#F5F6FC ' }}>
        <Container>
          <Row className="align-items-center pt-4">
            <Col md={6} sm={12}>
              <Row>
                <Col>
                  <h1 style={{ color: '#205072' }}>Whatsapp Bot</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </Col>
              </Row>
            </Col>
            <Col md={6} sm={12}>
              <Image alt="hero" src={botimg} width="80%" />
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#EEF6F4 ' }}>
        <Container>
          <Row className="align-items-center pt-4">
            <Col md={6} sm={12}>
              <Image alt="hero" src={integratorimg} width="80%" />
            </Col>
            <Col md={6} sm={12}>
              <Row>
                <Col>
                  <h1 style={{ color: '#205072' }}>Integrator Sistem</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div style={{ backgroundColor: '#F5F6FC ' }}>
        <Container>
          <Row className="align-items-center pt-4">
            <Col md={6} sm={12}>
              <Row>
                <Col>
                  <h1 style={{ color: '#205072' }}>Validasi Pembayaran Otomatis</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </Col>
              </Row>
            </Col>
            <Col md={6} sm={12}>
              <Image alt="hero" src={validasiimg} width="80%" />
            </Col>
          </Row>
        </Container>
      </div>
    </PublicLayout>
  );
};

export default Home;
