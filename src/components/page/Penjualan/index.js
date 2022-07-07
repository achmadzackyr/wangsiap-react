import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Table, Row, Col, Pagination, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as kon from '../../../constants';

const Penjualan = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(false);

  const Export = () => {
    setLoading(true);
    axios
      .get(`${kon.API_URL}/api/gateway/downloadLoader`, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        const today = new Date().toISOString().slice(0, 10).split('-').reverse().join('-');

        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, `${today}-loader.xlsx`);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetData = () => {
    setLoading(true);
    axios
      .post(`${kon.API_URL}/api/gateway/order-list?page=${page}`)
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
  };

  useEffect(() => {
    GetData();
  }, [page]);
  return (
    <PrivateLayout title="Penjualan" active="Penjualan" loading={loading}>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={8} sm={12}>
                  Filter
                </Col>
                <Col md={4} sm={12} className="d-flex justify-content-evenly">
                  <Button href="#" variant="wangsiap-primary" size="sm">
                    Saring
                  </Button>
                  <Button variant="warning" size="sm" onClick={GetData}>
                    Refresh
                  </Button>
                  <Button variant="secondary" size="sm" onClick={Export}>
                    Export
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
                <th>Pesanan</th>
                <th>Jumlah</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pelangganList.length > 0 &&
                pelangganList.map((data, index) => (
                  <tr key={index}>
                    <td>{data.tanggal_pesan_string}</td>
                    <td>{data.nama}</td>
                    <td>{data.deskripsi}</td>
                    <td>{data.total_pcs}</td>
                    <td className="text-center">{data.payment_id === 1 ? 'COD' : 'Non COD'}</td>
                    <td>{data.order_status_id}</td>
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
                ))}
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

export default Penjualan;