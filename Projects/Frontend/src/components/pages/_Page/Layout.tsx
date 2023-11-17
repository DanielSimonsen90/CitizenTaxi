import { Outlet } from "react-router-dom";

import Providers from 'providers';
import Header from 'components/shared/Header';
import Footer from 'components/shared/Footer';

export default function Layout() {
  return (
    <Providers>
      <Header />
      <Outlet />
      <Footer />
    </Providers>
  );
}