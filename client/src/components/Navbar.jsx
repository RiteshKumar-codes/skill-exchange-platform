import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { user, isAuthenticated, logout } = useAuth();
    return (
            <nav>
            <Link to="/">Skill Exchange</Link>

            {" | "}

            {isAuthenticated ? (
                <>
                    <Link to="/profile">
                        {user?.name || "My Profile"}
                    </Link>

                    {" | "}

                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>

                    {" | "}

                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar;