import React from 'react';
import { Button } from 'react-bootstrap';
import PublicLayout from '../../layout/public';

const Home = () => {
  return (
    <PublicLayout>
      <Button href="/home">Home</Button>
      <Button href="/about">About</Button>
      <Button href="/beranda">Beranda</Button>
    </PublicLayout>
  );
};

export default Home;
