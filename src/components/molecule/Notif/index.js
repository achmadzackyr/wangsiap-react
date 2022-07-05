import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

function Notif({ variant, children, show, setShow }) {
  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);
  if (!show) {
    return null;
  }
  return (
    <Alert key={variant} variant={variant} className="notif">
      {children}
    </Alert>
  );
}

export default Notif;
