import { getUserBalance } from '@/services/balanceService';
import useAuth from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import Loader from './common/Loader';

function GroupBalance({ groupId }) {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await getUserBalance(groupId);
                setBalance(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [groupId]);

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Group Balance</h2>
            <p>Total Contributions: {balance.totalContributions}</p>
            <p>Total Payouts: {balance.totalPayouts}</p>
            <p>Balance: {balance.balance}</p>
        </div>
    );
}
