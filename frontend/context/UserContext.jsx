import React from "react"
import { useEffect, useState, createContext, useContext } from "react"

export const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    logout: () => { },
    checkAuth: () => { }
})


export const UserProvider = ({ children }) => {
    const [estado, setEstado] = useState({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        sidebarExpanded: true,
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (user) => {
        setEstado({
            user: {
                username: user.username,
                usuario_id: user.usuario_id
            },
            isAuthenticated: true,
            isLoading: false
        })
    }
    const logout = async () => {

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
            })
            if (response.ok) {
                setEstado({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }

    }

    const toggleSidebar = () => {
        setEstado(prev => ({
            ...prev,
            sidebarExpanded: !prev.sidebarExpanded
        }));
    }

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/profile")

            if (response.ok) {
                const data = await response.json();
                setEstado({
                    user: {
                        username: data.data.profile.username,
                        usuario_id: data.data.profile.usuario_id
                    },
                    isAuthenticated: true,
                    isLoading: false
                })
            } else {
                setEstado({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            }
        } catch (error) {
            setEstado({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
        }
    }

    return (
        <UserContext.Provider value={{ ...estado, login, logout, checkAuth, toggleSidebar }}>
            {children}
        </UserContext.Provider >
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    return context;
};