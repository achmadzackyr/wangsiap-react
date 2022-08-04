import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Table, Row, Col, Pagination, Button, Form, Accordion, Modal } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as kon from '../../../constants';
import * as qs from 'qs';
import useToken from '../../hooks/useToken';
import useProfile from '../../hooks/useProfile';
import { useNavigate } from 'react-router-dom';

const Penjualan = () => {
  let navigate = useNavigate();

  const { token, setToken } = useToken();
  const { profile, setProfile } = useProfile();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState('2');
  const [noPenerima, setNoPenerima] = useState('');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [perPage, setPerPage] = useState(10);
  const [penjualan, setPenjualan] = useState({});
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const [notifVariant, setNotifVariant] = useState('success');
  const [deleteShow, setDeleteShow] = useState(false);

  const Export = () => {
    setLoading(true);
    var data = qs.stringify({
      order_status_id: orderStatus,
      no_penerima: noPenerima,
      date_from: dateFrom,
      date_to: dateTo
    });

    var config = {
      method: 'post',
      url: `${kon.API_URL}/api/gateway/downloadLoader`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data,
      responseType: 'arraybuffer'
    };

    axios(config)
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
    axios({
      method: 'post',
      url: `${kon.API_URL}/api/gateway/order-list`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        order_status_id: orderStatus,
        no_penerima: noPenerima,
        date_from: dateFrom,
        date_to: dateTo,
        per_page: perPage,
        page: page
      })
    })
      .then(function (response) {
        setPelangganList(response.data.data);

        let pageArray = [];
        let total_rows = response.data.data.length > 0 ? response.data.data[0].total_row : 0;
        let last_page = Math.ceil(total_rows / perPage);

        for (let number = 1; number <= last_page; number++) {
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
    GetProfile();
  }, []);

  useEffect(() => {
    GetData();
  }, [page]);

  const DeletePenjualan = () => {
    setLoading(true);
    setDeleteShow(false);
    axios({
      method: 'delete',
      url: `${kon.API_URL}/api/customers/${penjualan.customer_id}`,
      headers: {}
    })
      .then(function (response) {
        setPenjualan({});
        GetData();
        setNotifMsg('Berhasil menghapus penjualan');
        setNotifVariant('success');
      })
      .catch(function (error) {
        setNotifMsg(error.response.data.message);
        setNotifVariant('danger');
      })
      .finally(() => {
        setLoading(false);
        setShowNotif(true);
      });
  };

  const GetProfile = () => {
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
        setProfile(response.data.data);
        setNoPenerima(response.data.data.hp);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.reload();
          navigate('../../login', {
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

  const ShowDeleteModal = (ord) => {
    console.log(ord);
    setDeleteShow(true);
    setPenjualan(ord);
  };

  const HideDeleteModal = () => {
    setDeleteShow(false);
    setPenjualan({});
  };

  return (
    <PrivateLayout title="Penjualan" active="Penjualan" loading={loading}>
      <Row className="mb-3">
        <Col>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filter</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={3} sm={3}>
                    <Form.Group className="mb-3" controlId="filterDateFrom">
                      <Form.Label>Dari</Form.Label>
                      <Form.Control
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={3}>
                    <Form.Group className="mb-3" controlId="filterDateTo">
                      <Form.Label>Sampai</Form.Label>
                      <Form.Control
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={3}>
                    <Form.Group className="mb-3" controlId="formOrderStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        aria-label="Order Status"
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                      >
                        <option value="1">Pending</option>
                        <option value="2">Diterima</option>
                        <option value="5">Ditolak</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={3}>
                    <Form.Group className="mb-3" controlId="formPerPage">
                      <Form.Label>Per Halaman</Form.Label>
                      <Form.Select
                        aria-label="Per Page"
                        value={perPage}
                        onChange={(e) => setPerPage(e.target.value)}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-end">
                    <Button variant="warning" size="sm" className="ms-2" onClick={GetData}>
                      Tampilkan
                    </Button>
                    <Button variant="wangsiap-primary" size="sm" className="ms-2" onClick={Export}>
                      Export
                    </Button>
                    <Button href="penjualan/tambah" variant="secondary" size="sm" className="ms-2">
                      Tambah
                    </Button>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive size="sm">
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
              {pelangganList.length > 0 ? (
                pelangganList.map((data, index) => (
                  <tr key={index}>
                    <td className="text-center">{data.tanggal_pesan_string}</td>
                    <td>{data.nama}</td>
                    <td>{data.deskripsi}</td>
                    <td className="text-center">{data.total_pcs}</td>
                    <td className="text-center">{data.payment_id === 1 ? 'COD' : 'Non COD'}</td>
                    <td className="text-center">
                      {data.order_status_id === 1
                        ? 'Pending'
                        : data.order_status_id === 2
                        ? 'Diterima'
                        : data.order_status_id === 5 && 'Ditolak'}
                    </td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="wangsiap-primary"
                        href={`/penjualan/${data.order_id}`}
                      >
                        Detail
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="ms-1"
                        onClick={() => ShowDeleteModal(data)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    Penjualan anda untuk tanggal {dateFrom} s/d {dateTo} masih kosong
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
      <Modal
        size="sm"
        show={deleteShow}
        onHide={() => setDeleteShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">Yakin akan dihapus?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="text-center">{penjualan.nama}</h6>
          <h6 className="mb-4 text-center">{penjualan.deskripsi}</h6>
          <div className="d-flex justify-content-around">
            <Button variant="danger" onClick={() => DeletePenjualan()}>
              Hapus
            </Button>
            <Button className="btn-wangsiap-primary" onClick={() => HideDeleteModal()}>
              Batal
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </PrivateLayout>
  );
};

export default Penjualan;
