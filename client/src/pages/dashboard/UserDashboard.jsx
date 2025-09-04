import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import UserBalance from '@/components/layout/UserBalance';
import PageHeader from '@/components/layout/PageHeader';
import CTAButton from '@/components/common/CtaButton';
import { routes } from '@/routes/route';
import { Bell, Users, PlusCircle, Wallet } from 'lucide-react'; //icons
import '@/css/UserDashboard.css';

function UserDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return <p>Loading user info...</p>; // or just null if already handled higher up
    }

    return (
        <div>
            <PageHeader
                title={`Welcome, ${user.name || 'User'} 👋`}
                right={<Bell onClick={() => navigate(routes.notification)} />}
            />
            <UserBalance />
            <div className="cta-grid">
                <CTAButton
                    icon={Users}
                    label="Create Group"
                    onClick={() => navigate(routes.createGroup)}
                />
                <CTAButton
                    icon={PlusCircle}
                    label="Join Group"
                    onClick={() => {}}
                />
                <CTAButton
                    icon={Wallet}
                    label="View Wallet"
                    onClick={() => {}}
                />
            </div>
        </div>
    );
}

export default UserDashboard;
