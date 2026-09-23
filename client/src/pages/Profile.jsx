import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const {user, logout} = useAuth();

    return(
        <div>
            <h1>My Profile</h1>

            <p> Welcome, {user?.name}</p>

             <p>Email: {user?.email}</p>

             <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Profile;