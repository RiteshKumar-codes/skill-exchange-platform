import {
    createContext,
    useContext,
    useState
} from "react";

import {login as loginRequest} from "../services/authService";

const AuthContext = createContext(null);

 export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try{
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser): null;
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const login = async (credentials) => {
        const data = await loginRequest(credentials);

        if(!data.token || !data.user){
            throw new Error (
                "Unexpected login response from server"
            );
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return(
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token && user),
                login,
                logout
            }}
            >
                {children}
            </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }
    return context;
}