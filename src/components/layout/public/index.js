import React from 'react';
import Navibar from '../../molecule/Navibar';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navibar />
      <main>{children}</main>
    </>
  );
}
