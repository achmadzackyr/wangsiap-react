import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <Row>
          <Col>
            <div className="loading">
              <div className="loader"></div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Loading;
