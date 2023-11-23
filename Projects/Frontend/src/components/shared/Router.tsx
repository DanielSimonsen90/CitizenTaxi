import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookTaxi, BookTaxiSteps, NotFound } from 'components/pages';
import { AdminCitizenOverview, AdminBookingsOverview, AdminNotesOverview } from 'components/pages/Admin/pages';
import { Layout } from 'components/pages/_Page';
import Authenticate from 'components/pages/_Authenticate';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" Component={Layout}> {/* All pages must follow the Layout component */}
        {/* The Authenticate component is in charge of handling what component the user should see */}
        <Route index element={<Authenticate />} /> 
        
        {/* Citizen routes */}
        <Route path="bestil" Component={BookTaxi}>
          <Route path=":step" element={<BookTaxiSteps />} /> {/* The step the user is currently on */}
        </Route>

        {/* Admin routes */}
        <Route path="borgere" element={<AdminCitizenOverview />} />
        <Route path="noter" element={<AdminNotesOverview />} /> 
        <Route path="bestillinger" element={<AdminBookingsOverview />} />

        {/* If the user tries to access a route not registered, show the NotFound component */}
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