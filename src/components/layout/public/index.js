import React from 'react';
import Navibar from '../../organism/Navibar';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navibar />
      <main>{children}</main>
    </>
  );
}
