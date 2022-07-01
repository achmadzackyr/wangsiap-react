import React from 'react';
import Navibar from '../../molecule/Navibar';
import { Row } from 'react-bootstrap';
import Sidebar from '../../molecule/Sidebar';
import Loading from '../../molecule/Loading';

export default function PrivateLayout({ children, title, active, loading }) {
  return (
    <>
      <Navibar active={active} />
      <div className="container-fluid">
        <Row className="vh-100">
          <Sidebar active={active} />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Loading loading={loading} />
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{title}</h1>
            </div>
            <div>{children}</div>
          </main>
        </Row>
      </div>
    </>
  );
}
