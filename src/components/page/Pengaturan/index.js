import React, { useEffect, useState } from 'react';
import PrivateLayout from '../../layout/private';
import * as kon from '../../../constants';

function Pengaturan() {
  const [loading, setLoading] = useState(false);

  return (
    <PrivateLayout title="Pengaturan" active="Pengaturan" loading={loading}>
      Pengaturan
    </PrivateLayout>
  );
}

export default Pengaturan;
