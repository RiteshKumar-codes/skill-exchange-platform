import api from "./api";

const getProfile = async ()=> {
    const response = await api.get("users/profile");

    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await api.put(
        "users/profile",
        profileData
    );

    return response.data;
};

export { getProfile, updateProfile};