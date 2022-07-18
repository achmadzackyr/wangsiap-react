import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Image,
  Button,
  Tab,
  Tabs,
  Dropdown,
  DropdownButton,
  InputGroup,
  Table
} from 'react-bootstrap';
import wangsiaplogo from '../../../imgs/wangsiap-logo-dark.png';
import axios from 'axios';
import * as kon from '../../../constants';
import * as qs from 'qs';
import Loading from '../../molecule/Loading';
import { Link } from 'react-router-dom';

function Kodepos() {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState('cari');
  const [cariBy, setCariBy] = useState('kecamatan');

  const [searchBy, setSearchBy] = useState('district');
  const [searchValue, setSearchValue] = useState('');

  const [searchResult, setSearchResult] = useState([]);

  const cariByKabupaten = () => {
    setCariBy('kabupaten / kota');
    setSearchBy('city');
  };

  const cariByKecamatan = () => {
    setCariBy('kecamatan');
    setSearchBy('district');
  };

  const cariKodepos = (e) => {
    if (searchValue.length < 3) {
      alert('Kata pencarian minimal 3 huruf');
      e.preventDefault();
      return false;
    }

    setLoading(true);
    var data = qs.stringify({
      search_by: searchBy,
      search_value: searchValue
    });

    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/gateway/get-zip-by-destination`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setSearchResult(response.data.data);
      })
      .catch(function (error) {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
    e.preventDefault();
  };

  return (
    <div className="bg-light text-center vh-100">
      <Loading loading={loading} />
      <Container className="vh-100 py-2">
        <Link to="/">
          <Image
            alt="logo"
            src={wangsiaplogo}
            width="150"
            height="50"
            className="d-inline-block align-top mb-2"
          />
        </Link>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          fill
        >
          <Tab eventKey="cari" title="Cari Kodepos" style={{ color: 'black' }}>
            <Form
              onSubmit={(e) => {
                cariKodepos(e);
              }}
            >
              <InputGroup className="mb-3">
                <DropdownButton
                  variant="outline-secondary"
                  title={cariBy}
                  id="input-group-dropdown-1"
                >
                  <Dropdown.Item
                    onClick={() => {
                      cariByKecamatan();
                    }}
                  >
                    Kecamatan
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      cariByKabupaten();
                    }}
                  >
                    Kabupaten / Kota
                  </Dropdown.Item>
                </DropdownButton>
                <Form.Control
                  aria-label="Text input with dropdown button"
                  placeholder={`Masukkan nama ${cariBy}`}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              </InputGroup>
              <div className="d-grid gap-2">
                <Button variant="wangsiap-primary" type="submit">
                  Cari
                </Button>
              </div>

              {searchResult.length > 0 && (
                <Table striped bordered hover responsive size="sm" className="mt-5">
                  <thead>
                    <tr>
                      <th>Kodepos</th>
                      <th>Kelurahan</th>
                      <th>Kecamatan</th>
                      <th>Kabupaten/Kota</th>
                      <th>Propinsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResult.map((x) => {
                      return (
                        <tr>
                          <td>
                            {x.ZIP_CODE}{' '}
                            <i
                              className="bi bi-files"
                              style={{ color: '#25D366', cursor: 'pointer' }}
                              onClick={() => {
                                navigator.clipboard.writeText(x.ZIP_CODE);
                                alert(`${x.ZIP_CODE} Berhasil Disalin`);
                              }}
                            ></i>
                          </td>
                          <td>{x.SUBDISTRICT_NAME}</td>
                          <td>{x.DISTRICT_NAME}</td>
                          <td>{x.CITY_NAME}</td>
                          <td>{x.PROVINCE_NAME}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Form>
          </Tab>
          <Tab eventKey="cek" title="Cek Kodepos">
            Cek
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default Kodepos;
