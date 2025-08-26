import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@css/Signup.css';
import { registerUser } from '../../services/auth';

function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);
    

    const [form , setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setMessage("❌ Passwords do not match");
            return;
        }
        setLoading(true);
        setMessage(""); 
        try {
            const data = await registerUser(form);
            localStorage.setItem('user', JSON.stringify(data));
            setMessage("✅ Account created successfully!");
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            setMessage("❌ " + (error.message || "Registration failed"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h2 className="signup-title">Create an Account</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    onChange={handleChange}
                    value={form.name}
                    required
                />
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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create password"
                            value={form.password}
                            onChange={handleChange}
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

                <div className="input-group password-group">
                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="toggle-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                </div>
                 {message && <p className="error-message">{message}</p>}


                <label className="terms">
                    <input type="checkbox" required />
                    <span>I agree to the <a href="/terms">Terms & Conditions</a></span>
                </label>

                <button type="submit" className="signup-btn" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </>
    );
}

export default Signup;
