import { Outlet } from "react-router-dom";

import Providers from 'providers';
import Header from 'components/shared/Header';
import Footer from 'components/shared/Footer';

/**
 * Layout component that wraps all pages.
 * The outlet is where the page content will be rendered.
 */
export default function Layout() {
  return (
    <Providers>
      <Header />
      <Outlet />
      <Footer />
    </Providers>
  );
}