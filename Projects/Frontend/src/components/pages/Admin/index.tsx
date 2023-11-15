import PageLayout from "../_Page";
import AdminDashboard from "./AdminDashboard";
import './AdminDashboard.scss';

export default function AdminPage() {
  return (
    <PageLayout title="Admin Dashboard" description="Administrator side">
      <AdminDashboard />
    </PageLayout>
  );
}