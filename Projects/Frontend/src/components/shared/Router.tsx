import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotFound } from 'components/pages';
import { Layout } from 'components/pages/_Page';
import Authenticate from 'components/pages/_Authenticate';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" Component={Layout}>
        <Route path="/" element={<Authenticate />}>
          {/* <Route path="borgere" element={<CitizenOverview />} /> */}
          {/* <Route path="noter" element={<NotesOverview />} /> */}
          {/* <Route path="bestillinger" element={<BookingsOverview />} /> */}
          {/* <Route path="bestil" element={<BookTaxi />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;

/*
Admin:
  /: AdminDashboard
  /citizen: CitizenOverview
  /notes: NotesOverview
  /bookings: BookingsOverview'

Citizen:
  /: CitizenDashboard
  /book?step=x

*/