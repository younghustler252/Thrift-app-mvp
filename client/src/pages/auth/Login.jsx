// src/pages/Login.jsx

import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/AuthProvider';
import Button from '@/components/common/Button';
import { routes } from '@/routes/route';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import '@/css/Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            console.log('Form submitted:', form);

            const data = await loginUser(form);
            const { token, ...user } = data;
            login(token, user);
            navigate(routes.dashboard);
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            setMessage(
                '❌ ' + (error?.response?.data?.message || error.message),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">
                Log in to continue your savings journey
            </p>

            <form onSubmit={handleSubmit} className="login-form">
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
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            value={form.password}
                            required
                        />
                        <span onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>
                </div>

                <div className="form-options solo-link">
                    <Link
                        to={routes.forgotPassword}
                        className="forgot-password">
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading} // 👈 handles loader inside
                >
                    Login
                </Button>

                {message && <p className="login-message">{message}</p>}
            </form>

            <div className="signup-link">
                <p>
                    Don't have an account?{' '}
                    <Link to={routes.signup}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
