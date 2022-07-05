import React, { useState } from 'react';
import { NavLink, NavItem } from 'react-bootstrap';
import useProfile from '../../hooks/useProfile';

export default function Sidebar({ active }) {
  const { profile, setProfile } = useProfile();

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div
        className="d-flex justify-content-center bg-white py-2 mt-2 mx-3"
        style={{ borderRadius: '5px', color: '#666' }}
      >
        {profile}
      </div>
      <div className="position-sticky pt-2">
        <ul className="nav flex-column">
          <NavItem>
            <NavLink className={active === 'Beranda' && 'active'} href="/beranda">
              <i className="bi bi-speedometer2"></i>
              Beranda
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Penjualan' && 'active'} href="/penjualan">
              <i className="bi bi-cart2"></i>
              Penjualan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Produk' && 'active'} href="/produk">
              <i className="bi bi-box-seam"></i>
              Produk
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Pelanggan' && 'active'} href="/pelanggan">
              <i className="bi bi-people"></i>
              Pelanggan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Laporan' && 'active'} href="/laporan">
              <i className="bi bi-file-text"></i>
              Laporan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Pengaturan' && 'active'} href="/pengaturan">
              <i className="bi bi-gear"></i>
              Pengaturan
            </NavLink>
          </NavItem>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
          <span>Master</span>
          <a className="link-secondary" href="#" aria-label="Add a new report"></a>
        </h6>
        <ul className="nav flex-column mb-2">
          <NavItem>
            <NavLink className={active === 'Akun' && 'active'} href="/master/akun">
              <i className="bi bi-person"></i>
              Akun
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Pengiriman' && 'active'} href="/master/pengiriman">
              <i className="bi bi-truck"></i>
              Pengiriman
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={active === 'Pemabayaran' && 'active'} href="/master/pembayaran">
              <i className="bi bi-wallet2"></i>
              Pembayaran
            </NavLink>
          </NavItem>
        </ul>
      </div>
    </nav>
  );
}
