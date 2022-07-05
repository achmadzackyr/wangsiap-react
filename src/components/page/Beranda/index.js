import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import * as kon from '../../../constants';
import useToken from '../../hooks/useToken';
import Login from '../Login';

const Beranda = () => {
  const [loading, setLoading] = useState(false);
  // const { token, setToken } = useToken();

  // if (!token) {
  //   return <Login setToken={setToken} />;
  // }

  return (
    <PrivateLayout title="Beranda" active="Beranda" loading={loading}>
      Beranda
    </PrivateLayout>
  );
};

export default Beranda;
