import { useAuth } from '@/context/AuthProvider';
import PageHeader from '@/components/layout/PageHeader';
import { Bell } from 'lucide-react';

function AdminDashboard() {
    const { user } = useAuth();
    if (!user) {
        return <p>Loading admin info...</p>; // Or null if handled higher up
    }

    return (
        <PageHeader
            title={`Welcome, ${user.name || 'Admin'} 👋`}
            right={<Bell />}
        />
    );
}

export default AdminDashboard;
