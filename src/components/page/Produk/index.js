import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import { Table, Row, Col, Pagination, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';
import * as qs from 'qs';
import { useLocation, useNavigate } from 'react-router-dom';
import Notif from '../../molecule/Notif';
import useToken from '../../hooks/useToken';

const Produk = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const { token, setToken } = useToken();

  const [product, setProduct] = useState({});
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState(location.state ? location.state.msg : '');
  const [notifVariant, setNotifVariant] = useState(
    location.state ? location.state.variant : 'success'
  );
  const [deleteShow, setDeleteShow] = useState(false);

  const GetData = () => {
    setLoading(true);
    axios({
      method: 'post',
      url: `${kon.API_URL}/api/products/get-my-product`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: qs.stringify({})
    })
      .then(function (response) {
        setPelangganList(response.data.data.data);

        let pageArray = [];
        for (let number = 1; number <= response.data.data.last_page; number++) {
          pageArray.push(number);
        }
        setItems(pageArray);
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
          setNotifMsg(error.response.data.message);
          setNotifVariant('danger');
          setShowNotif(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    GetData();
  }, [page]);

  useEffect(() => {
    if (location.state) {
      setShowNotif(true);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const DeleteProduct = () => {
    setLoading(true);
    axios({
      method: 'delete',
      url: `${kon.API_URL}/api/products/${product.id}`,
      headers: {}
    })
      .then(function (response) {
        setDeleteShow(false);
        setProduct({});
        GetData();
        setNotifMsg('Berhasil menghapus produk');
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

  const ShowDeleteModal = (prod) => {
    setDeleteShow(true);
    setProduct(prod);
  };

  const HideDeleteModal = () => {
    setDeleteShow(false);
    setProduct({});
  };

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
                  {/* <Button href="#" variant="wangsiap-primary" size="sm">
                    Saring
                  </Button> */}
                  <Button href="produk/tambah" variant="secondary" size="sm">
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
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr className="text-center">
                <th>SKU</th>
                <th>Nama</th>
                <th>Harga (Rp)</th>
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
                    <td>{data.sku}</td>
                    <td>{data.nama}</td>
                    <td className="text-center">
                      {Number(Math.round(data.harga).toFixed(1)).toLocaleString('id-ID')}
                    </td>
                    <td className="text-center">{data.aktif === 1 ? 'Aktif' : 'Non Aktif'}</td>
                    <td className="text-center">
                      <Button size="sm" variant="wangsiap-primary" href={`/produk/${data.sku}`}>
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
                  <td colSpan={5} className="text-center">
                    Produk anda masih kosong
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
      {showNotif && (
        <Notif variant={notifVariant} show={showNotif} setShow={setShowNotif}>
          {notifMsg}
        </Notif>
      )}
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
          <h6 className="text-center">{product.sku}</h6>
          <h6 className="mb-4 text-center">{product.nama}</h6>
          <div className="d-flex justify-content-around">
            <Button variant="danger" onClick={() => DeleteProduct()}>
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

export default Produk;
