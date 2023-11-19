import './BookTaxi.scss';
import BookTaxi from './BookTaxi';
import PageLayout from '../_Page';
import { useParams } from 'react-router-dom';
import { usePageSteps } from './BookTaxiHooks';
import { useStateInQuery } from 'hooks';
import { BookingModifyPayload } from 'models/backend/business/models/payloads';
import { StepData } from './Steps/StepTypes';
import { useEffect } from 'react';

export default function BookTaxiPage() {
  const {
    trin: step = "1",
    bookingId
  } = useParams();
  const [payload, setPayload] = useStateInQuery<Partial<BookingModifyPayload<false>>>('booking', { id: bookingId });
  const { title, description, component: Step, canContinue, canGoBack } = usePageSteps(step);
  
  const redirectToNextStep = <Step extends keyof StepData>(data: StepData[Step]) => {
    setPayload(prev => ({ ...prev, ...data }));
  }

  useEffect(() => {
    if (Object.keys(payload).length) {
      console.log('Submit payload', payload);
    }
  }, [step, payload]);

  return (
    <PageLayout title="Taxibestilling" description='Bestil en taxi'>
      <BookTaxi {...{ 
        title, description, step, 
        canGoBack, canContinue, redirectToNextStep 
      }}>
        <Step bookingId={bookingId} />
      </BookTaxi>
    </PageLayout>
  )
}