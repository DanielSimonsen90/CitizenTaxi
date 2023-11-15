import PageLayout from "../_Page";
import NotFound from "./NotFound";
import './NotFound.scss';

export default function NotFoundPage() {
  return (
    <PageLayout title="404" description="Siden blev ikke fundet">
      <NotFound />
    </PageLayout>
  );
}