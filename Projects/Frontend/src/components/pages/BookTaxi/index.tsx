import './BookTaxi.scss';
import BookTaxi from './BookTaxi';
import PageLayout from '../_Page';

export default function BookTaxiPage() {
  return (
    <PageLayout title="Taxibestilling" description='Bestil en taxi'>
      <BookTaxi />
    </PageLayout>
  )
}