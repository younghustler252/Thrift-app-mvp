import { useEffect, useState } from 'react';
import BalanceCard from '../cards/BalanceCard';
import { getGlobalBalance } from '@/services/balanceService';
import Loader from '../common/Loader';

function UserBalance() {
    const [balanceData, setBalanceData] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await getGlobalBalance();
                console.log('User Balance API Response:', data);
                setBalanceData(data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
    }, []);

    if (!balanceData) {
        return <Loader />;
    }

    return (
        <BalanceCard
            title="User Balance"
            balance={balanceData.balance}
            contributions={balanceData.contributions}
            payouts={balanceData.payouts}
        />
    );
}

export default UserBalance;
