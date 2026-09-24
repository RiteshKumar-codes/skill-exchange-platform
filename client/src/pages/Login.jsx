import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const {login} = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try{
            await login(formData);
            navigate("/profile");
        } catch(error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );
        } finally{
            setLoading(false);
        }
    };


  return (
    <div>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <p role="alert">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p>
                Dont't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>
    </div>
  )
}

export default Login;