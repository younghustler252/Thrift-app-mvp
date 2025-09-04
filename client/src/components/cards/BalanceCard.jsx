import React from 'react';
import '@/css/BalanceCard.css';
import formatCurrency from '@/utils/FormatCurrency';

const BalanceCard = ({ title, contributions, payouts, balance }) => {
    return (
        <div className="balance-card">
            <div className="balance-header">
                <h3>{title}</h3>
            </div>

            {/* Balance shown first */}
            <div className="balance-main">
                <span className="label">Balance</span>
                <span className="value">{formatCurrency(balance)}</span>
            </div>

            {/* Contributions & Payouts on one row */}
            <div className="balance-row">
                <div className="balance-item">
                    <span className="label">Contributions</span>
                    <span className="value">
                        {formatCurrency(contributions)}
                    </span>
                </div>
                <div className="balance-item">
                    <span className="label">Payouts</span>
                    <span className="value">{formatCurrency(payouts)}</span>
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;
