import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

// Axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Decode token or fetch user profile here if needed
            // For now, just set a placeholder user
            setUser({ email: 'user@example.com' }); // Replace with real decryption or fetch
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email); // OAuth2 expects username
        formData.append('password', password);

        try {
            const response = await api.post('/auth/login', formData);
            setToken(response.data.access_token);
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || "Login failed";
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await api.post('/auth/signup', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data?.detail || "Signup failed";
        }
    };

    const logout = () => {
        setToken(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
