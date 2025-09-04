import { useEffect, useState } from 'react';
import { getAllGroups, getGroups } from '@/services/groupService';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import '@/css/Group.css';
import { routes } from '@/routes/route';
function Groups() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        async function fetchGroups() {
            setLoading(true);
            try {
                let res;
                if (user.role === 'admin') {
                    res = await getAllGroups();
                } else {
                    res = await getGroups(user.id);
                }

                const groupList = Array.isArray(res)
                    ? res
                    : res.groups || res.data || [];

                setGroups(groupList);
            } catch (err) {
                console.error('Error fetching groups:', err);
                setError('Failed to load groups');
            } finally {
                setLoading(false);
            }
        }

        fetchGroups();
    }, [user]);

    const filteredGroups = groups.filter((g) => {
        if (filter === 'creator') return g.creatorId === user.id;
        if (filter === 'member') return g.creatorId !== user.id;
        return true;
    });

    return (
        <div className="groups-container">
            <div className="groups-filters">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}>
                    All
                </button>
                <button
                    className={filter === 'creator' ? 'active' : ''}
                    onClick={() => setFilter('creator')}>
                    Creator
                </button>
                <button
                    className={filter === 'member' ? 'active' : ''}
                    onClick={() => setFilter('member')}>
                    Member
                </button>
            </div>

            {loading && <p className="groups-loading">Loading...</p>}

            {error && <p className="groups-error">{error}</p>}

            {!loading && !error && filteredGroups.length === 0 && (
                <p className="groups-empty">No groups found.</p>
            )}

            <ul className="groups-list">
                {filteredGroups.map((g) => (
                    <li
                        key={g.id}
                        className="group-card"
                        onClick={() =>
                            navigate(routes.groupDetails.replace(':id', g._id))
                        }>
                        <h2 className="group-name">{g.name}</h2>
                        <p className="group-description">{g.description}</p>
                        <p className="group-meta">
                            Members: {g.members.length} | Payout: {g.payout}
                        </p>
                        <p
                            className={`group-tag ${g.creatorId === user.id ? 'creator' : 'member'}`}>
                            {g.creatorId === user.id ? 'Creator' : 'Member'}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Groups;
