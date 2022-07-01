import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PrivateLayout from '../../layout/private';
import Loading from '../../molecule/Loading';
import * as kon from '../../../constants';

const PelangganDetail = () => {
  const { pelangganId } = useParams();

  const [pel, setPel] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${kon.API_URL}/api/customers/${pelangganId}`)
      .then(function (response) {
        setPel(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <PrivateLayout title={pel.nama} active="Pelanggan" loading={loading}>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>{pel.alamat}</div>
      )}
    </PrivateLayout>
  );
};

export default PelangganDetail;
