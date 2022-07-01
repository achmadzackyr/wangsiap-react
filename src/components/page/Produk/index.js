import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Table, Row, Col, Pagination, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';

const Produk = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${kon.API_URL}/api/products?page=${page}`)
      .then(function (response) {
        setPelangganList(response.data.data.data);

        let pageArray = [];
        for (let number = 1; number <= response.data.data.last_page; number++) {
          pageArray.push(number);
        }
        setItems(pageArray);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);
  return (
    <PrivateLayout title="Produk" active="Produk" loading={loading}>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={9} sm={12}>
                  Filter
                </Col>
                <Col md={3} sm={12} className="d-flex justify-content-evenly">
                  <Button href="#" variant="wangsiap-primary" size="sm">
                    Saring
                  </Button>
                  <Button href="#" variant="secondary" size="sm">
                    Tambah
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover size="sm">
            <thead>
              <tr className="text-center">
                <th>SKU</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <Loading />
                  </td>
                </tr>
              ) : (
                pelangganList.length > 0 &&
                pelangganList.map((data, index) => (
                  <tr key={index}>
                    <td>{data.sku}</td>
                    <td>{data.nama}</td>
                    <td>{data.harga}</td>
                    <td className="text-center">{data.aktif === 1 ? 'Aktif' : 'Non Aktif'}</td>
                    <td className="d-flex justify-content-evenly">
                      <Button size="sm" variant="wangsiap-primary">
                        Detail
                      </Button>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                      <Button size="sm" variant="danger">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Pagination>
            {items.length > 0 &&
              items.map((data) => (
                <Pagination.Item key={data} active={data === page} onClick={() => setPage(data)}>
                  {data}
                </Pagination.Item>
              ))}
          </Pagination>
        </Col>
      </Row>
    </PrivateLayout>
  );
};

export default Produk;
