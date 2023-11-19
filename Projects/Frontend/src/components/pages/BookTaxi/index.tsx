import './BookTaxiLayout.scss';
import BookTaxiLayout from './BookTaxiLayout';
import PageLayout from '../_Page';

export { default as BookTaxiSteps } from './Steps';
export default function BookTaxiPage() {
  return (
    <PageLayout title="Taxibestilling" description='Bestil en taxi'>
      <BookTaxiLayout />
    </PageLayout>
  )
}