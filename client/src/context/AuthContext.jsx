import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () =>{
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //check if user is logged in 
    useEffect(()=>{
        setLoading(false);
    }, []);

    const register = async (formData) => {
        try {
            const response = await api.post("users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post("/users/login", credentials);

            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    };

    const logout = async () => {
        try {
            await api.post("/users/logout");
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}