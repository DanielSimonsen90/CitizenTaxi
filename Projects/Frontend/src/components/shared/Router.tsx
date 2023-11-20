import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookTaxi, BookTaxiSteps, NotFound } from 'components/pages';
import { Layout } from 'components/pages/_Page';
import Authenticate from 'components/pages/_Authenticate';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" Component={Layout}> {/* All pages must follow the Layout component */}
        <Route index element={<Authenticate />} /> {/* The Authenticate component is in charge of handling what component the user should see */}
        {/* <Route path="borgere" element={<CitizenOverview />} /> */}
        {/* <Route path="noter" element={<NotesOverview />} /> */}
        {/* <Route path="bestillinger" element={<BookingsOverview />} /> */}
        <Route path="bestil" Component={BookTaxi}>
          <Route path=":step" element={<BookTaxiSteps />} /> {/* The step the user is currently on */}
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} /> {/* If the user tries to access a route not registered, show the NotFound component */}
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