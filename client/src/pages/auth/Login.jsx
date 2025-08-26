import { useNavigate } from 'react-router-dom';
import '@css/Login.css';
import { useState } from 'react';
import { loginUser } from '../../services/auth';

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [form , setForm ] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
         setLoading(true);
        try {
            const data = await loginUser(form);
            localStorage.setItem('user', JSON.stringify(data));
            setMessage("✅ Logged in successfully. Token: " + data.token);
            navigate('/dashboard');
        } catch (error) {
            setMessage("❌ " + error.message);
        } finally{
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="login-title">Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    value={form.email}
                    required
                />

                <div className="input-group password-group">
                    <div className="password-wrapper">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            onChange={handleChange}
                            value={form.password}
                            required
                        />
                        <span
                            className="toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                </div>

                <div className="form-options">
                    <label className="remember-me">
                        <input type="checkbox" />
                        <span className="remember-label">Remember me</span>
                    </label>
                    <a href="/forgot-password" className="forgot-password">
                        Forgot Password?
                    </a>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                {message && <p className="login-message">{message}</p>}
            </form>
        </>
    );
}

export default Login;
