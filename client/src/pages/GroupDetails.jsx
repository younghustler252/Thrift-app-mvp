// src/pages/GroupDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { getGroupById } from '@/services/groupService';
import Loader from '@/components/common/Loader';
import PageHeader from '@/components/layout/PageHeader';
import '@/css/GroupDetails.css';

function GroupDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await getGroupById(id);
                setGroup(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGroup();
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <p className="error">{error}</p>;
    if (!group) return <p>No group found</p>;

    const isCreator = group.createdBy?.toString() === user._id?.toString();
    const isMember = group.members?.some(
        (m) => m.user?.toString() === user._id?.toString(),
    );

    return (
        <div className="group-details-page">
            {/* Header */}
            <PageHeader title={group.name} showBack />

            {/* Group Info Card */}
            <div className="group-card">
                <div className="group-avatar">
                    {group.name.charAt(0).toUpperCase()}
                </div>
                <div className="group-info">
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <small>
                        Contribution: {group.contributionType} | Frequency:{' '}
                        {group.frequency}
                    </small>
                </div>
            </div>

            {/* Balances */}
            {isCreator ? (
                <div className="balance-card">
                    <h3>Group Balance</h3>
                    <p className="balance">₦{group.groupBalance || 0}</p>
                </div>
            ) : isMember ? (
                <div className="balance-card">
                    <h3>Your Balance</h3>
                    <p className="balance">
                        ₦
                        {group.members.find((m) => {
                            const memberId =
                                typeof m.user === 'object'
                                    ? m.user._id?.toString()
                                    : m.user?.toString();
                            return memberId === user._id?.toString();
                        })?.contribution || 0}
                    </p>
                    <small>Next Payout: {group.nextPayoutDate || 'TBD'}</small>
                </div>
            ) : (
                <p className="not-member">
                    You are not a member of this group.
                </p>
            )}

            {/* Members List */}
            <div className="members-card">
                <h3>Members</h3>
                <ul>
                    {group.members?.map((m) => {
                        const memberId =
                            typeof m.user === 'object'
                                ? m.user._id?.toString()
                                : m.user?.toString();

                        const memberName =
                            typeof m.user === 'object'
                                ? m.user.name || m.user.email || 'Unnamed'
                                : 'Member';

                        return (
                            <li key={memberId} className="member-row">
                                <div className="avatar">
                                    {memberName.charAt(0).toUpperCase()}
                                </div>
                                <div className="member-info">
                                    <span>{memberName}</span>
                                    <small>
                                        {memberId ===
                                        group.createdBy?.toString()
                                            ? 'Creator'
                                            : 'Member'}
                                        {memberId === user._id?.toString() &&
                                            ' (You)'}
                                    </small>
                                </div>
                                <span className="amount">
                                    ₦{m.contribution || 0}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Actions */}
            <div className="action-buttons">
                {isCreator ? (
                    <>
                        <button
                            className="btn primary"
                            onClick={() => navigate()}>
                            Edit Group
                        </button>
                        <button className="btn secondary">
                            Manage Payouts
                        </button>
                    </>
                ) : isMember ? (
                    <>
                        <button className="btn primary">Contribute</button>
                        <button className="btn secondary">Leave Group</button>
                    </>
                ) : (
                    <button className="btn primary">Request to Join</button>
                )}
            </div>
        </div>
    );
}

export default GroupDetails;
