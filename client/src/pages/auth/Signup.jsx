// src/pages/Signup.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '@/services/authService';
import { useAuth } from '@/context/AuthProvider';
import Loader from '@/components/common/Loader';
import { routes } from '@/routes/route';
import '@/css/Signup.css';

function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setMessage('❌ Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const data = await registerUser(form);
            const { token, ...user } = data;

            login(token, user); // login via context
            setMessage('✅ Account created!');
            navigate(routes.dashboard);
        } catch (error) {
            setMessage(
                '❌ ' + (error?.response?.data?.message || error.message),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Create an Account</h2>
            <p className="signup-subtitle">
                Start saving with your Ajo account
            </p>

            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        onChange={handleChange}
                        value={form.name}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        onChange={handleChange}
                        value={form.email}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Create password"
                            onChange={handleChange}
                            value={form.password}
                            required
                        />

                        <span onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="password-input">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            onChange={handleChange}
                            value={form.confirmPassword}
                            required
                        />
                        <span
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }>
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>

                <label className="terms">
                    <input type="checkbox" required />
                    <span>
                        I agree to the{' '}
                        <Link to="/terms">Terms & Conditions</Link>
                    </span>
                </label>

                <button type="submit" className="signup-btn" disabled={loading}>
                    {loading ? <Loader /> : 'Sign Up'}
                </button>

                {message && <p className="signup-message">{message}</p>}
            </form>
            <div className="login-link">
                <p>
                    Already have an account?{' '}
                    <Link to={routes.login}>Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
