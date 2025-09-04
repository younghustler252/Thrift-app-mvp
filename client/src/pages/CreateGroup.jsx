import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { createGroup } from '@/services/groupService';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import '@/css/CreateGroup.css';

function CreateGroup() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        description: '',
        contributionType: 'fixed',
        contributionAmount: '',
        frequency: '',
        startDate: '',
        privacy: 'private',
    });

    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await createGroup(form, token);

            if (res.error) {
                throw new Error(res.error);
            }

            // ✅ Redirect after success
            navigate('/groups');
        } catch (error) {
            console.error('CreateGroup error:', error);
            alert(error.message || 'Something went wrong creating the group.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-group-page">
            <PageHeader title="Create Group" showBack />

            <form className="group-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Group Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Group Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />

                <select
                    name="contributionType"
                    value={form.contributionType}
                    onChange={handleChange}>
                    <option value="fixed">Fixed</option>
                    <option value="variable">Flexible</option>
                </select>

                <input
                    type="number"
                    name="contributionAmount"
                    placeholder="Contribution Amount"
                    value={form.contributionAmount}
                    onChange={handleChange}
                    required
                />

                <select
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>

                <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                />

                <select
                    name="privacy"
                    value={form.privacy}
                    onChange={handleChange}>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>

                <Button disabled={loading} type="submit">
                    {loading ? 'Creating...' : 'Create Group'}
                </Button>
            </form>
        </div>
    );
}

export default CreateGroup;
