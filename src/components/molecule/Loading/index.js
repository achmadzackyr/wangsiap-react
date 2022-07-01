import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <Row>
          <Col>
            <div class="loading">
              <div class="loader"></div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Loading;
