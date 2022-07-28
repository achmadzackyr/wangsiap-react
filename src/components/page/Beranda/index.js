import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import axios from 'axios';
import * as kon from '../../../constants';
import useToken from '../../hooks/useToken';
import Login from '../Login';
import { useNavigate } from 'react-router-dom';

const Beranda = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { token, setToken } = useToken();

  // if (!token) {
  //   return <Login setToken={setToken} />;
  // }

  useEffect(() => {
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
        console.log(response.data);
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
          alert(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PrivateLayout title="Beranda" active="Beranda" loading={loading}>
      Beranda
    </PrivateLayout>
  );
};

export default Beranda;
