import React from 'react';
import { Button } from 'react-bootstrap';
import PublicLayout from '../../layout/public';

const Home = () => {
  return (
    <PublicLayout>
      <Button href="/beranda">Beranda</Button>
      <Button href="/kodepos">Kodepos</Button>
    </PublicLayout>
  );
};

export default Home;
