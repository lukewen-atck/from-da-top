import { getAdminData } from './actions';
import AdminDashboard from '../../components/AdminDashboard';

// Force dynamic rendering so that admin data is always fresh
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const data = await getAdminData();
    return <AdminDashboard initialData={data} />;
}
