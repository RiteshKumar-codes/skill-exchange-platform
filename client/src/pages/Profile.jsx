import { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile
} from "../services/profileService";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, logout } = useAuth();

    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        city: "",
        skillsOffered: "",
        skillsWanted: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProfile();

                const currentUser =
                    data.user || data;

                setProfile(currentUser);

                setFormData({
                    name: currentUser.name || "",
                    bio: currentUser.bio || "",
                    city: currentUser.city || "",
                    skillsOffered:
                        currentUser.skillsOffered?.join(", ") || "",
                    skillsWanted:
                        currentUser.skillsWanted?.join(", ") || ""
                });

            } catch (error) {
                console.error(
                    "Profile fetch error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const updatedData = {
                name: formData.name.trim(),

                bio: formData.bio.trim(),

                city: formData.city.trim(),

                skillsOffered:
                    formData.skillsOffered
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),

                skillsWanted:
                    formData.skillsWanted
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
            };

            const data =
                await updateProfile(updatedData);

            const updatedUser =
                data.user || data;

            setProfile(updatedUser);

            setFormData({
                name: updatedUser.name || "",
                bio: updatedUser.bio || "",
                city: updatedUser.city || "",
                skillsOffered:
                    updatedUser.skillsOffered?.join(", ") || "",
                skillsWanted:
                    updatedUser.skillsWanted?.join(", ") || ""
            });

            setSuccess(
                "Profile updated successfully"
            );

        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>My Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div>
                <h1>My Profile</h1>

                <p role="alert">
                    {error}
                </p>

                <button onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h1>My Profile</h1>

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            {success && (
                <p role="status">
                    {success}
                </p>
            )}

            <p>
                Email: {profile?.email}
            </p>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">
                        Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="bio">
                        Bio
                    </label>

                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div>
                    <label htmlFor="city">
                        City
                    </label>

                    <input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="skillsOffered">
                        Skills I Offer
                    </label>

                    <input
                        id="skillsOffered"
                        name="skillsOffered"
                        value={formData.skillsOffered}
                        onChange={handleChange}
                        placeholder="JavaScript, React, Node.js"
                    />
                </div>

                <div>
                    <label htmlFor="skillsWanted">
                        Skills I Want to Learn
                    </label>

                    <input
                        id="skillsWanted"
                        name="skillsWanted"
                        value={formData.skillsWanted}
                        onChange={handleChange}
                        placeholder="Python, AWS, Docker"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>

            </form>

            <hr />

            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Profile;