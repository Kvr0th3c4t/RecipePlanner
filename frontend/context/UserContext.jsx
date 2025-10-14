import React from "react"
import { useEffect, useState, createContext, useContext, useRef } from "react"
import toast from "react-hot-toast"

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

    const sessionCheckInterval = useRef(null);
    const hasShownExpiredToast = useRef(false);

    useEffect(() => {
        checkAuth();

        const sessionExpiredMessage = sessionStorage.getItem('sessionExpired');
        if (sessionExpiredMessage) {
            toast.error(sessionExpiredMessage, {
                duration: 5000,
                icon: '🔒',
            });
            sessionStorage.removeItem('sessionExpired');
        }
    }, []);

    useEffect(() => {
        if (estado.isAuthenticated) {
            sessionCheckInterval.current = setInterval(() => {
                checkSessionStatus();
            }, 10000);

            return () => {
                if (sessionCheckInterval.current) {
                    clearInterval(sessionCheckInterval.current);
                }
            };
        }
    }, [estado.isAuthenticated]);

    const checkSessionStatus = async () => {
        try {
            const response = await fetch("/api/profile");

            if (!response.ok) {
                handleSessionExpired();
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    };

    const login = (user) => {
        hasShownExpiredToast.current = false;
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
        if (sessionCheckInterval.current) {
            clearInterval(sessionCheckInterval.current);
        }

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
                window.location.href = '/';
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }

    const handleSessionExpired = () => {
        if (hasShownExpiredToast.current) return;
        hasShownExpiredToast.current = true;

        if (sessionCheckInterval.current) {
            clearInterval(sessionCheckInterval.current);
        }

        sessionStorage.setItem('sessionExpired', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');

        setEstado({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });

        window.location.href = '/';
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