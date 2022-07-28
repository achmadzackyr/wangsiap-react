import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Table, Row, Col, Pagination, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';

const Pelanggan = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${kon.API_URL}/api/customers?page=${page}`)
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
    <PrivateLayout title="Pelanggan" active="Pelanggan" loading={loading}>
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
                <th>Tanggal</th>
                <th>Nama</th>
                <th>HP</th>
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
              ) : pelangganList.length > 0 ? (
                pelangganList.map((data, index) => (
                  <tr key={index}>
                    <td>{data.order_date_string}</td>
                    <td>{data.nama}</td>
                    <td>{data.hp}</td>
                    <td className="text-center">Pending</td>
                    <td className="d-flex justify-content-evenly">
                      <Button size="sm" variant="wangsiap-primary" href={`/pelanggan/${data.id}`}>
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
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    Belum ada pelanggan
                  </td>
                </tr>
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

export default Pelanggan;
