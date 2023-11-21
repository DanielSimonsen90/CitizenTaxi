import './BookTaxiLayout.scss';
import BookTaxiLayout from './BookTaxiLayout';
import PageLayout from '../_Page';
import CitizenProvider from 'providers/CitizenProvider';

export { default as BookTaxiSteps } from './Steps';
export default function BookTaxiPage() {
  return (
    <PageLayout title="Taxibestilling" description='Bestil en taxi'>
      <CitizenProvider>
        <BookTaxiLayout />
      </CitizenProvider>
    </PageLayout>
  )
}