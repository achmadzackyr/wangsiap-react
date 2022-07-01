import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import * as kon from '../../../constants';

const Beranda = () => {
  const [loading, setLoading] = useState(false);

  return (
    <PrivateLayout title="Beranda" active="Beranda" loading={loading}>
      Beranda
    </PrivateLayout>
  );
};

export default Beranda;
