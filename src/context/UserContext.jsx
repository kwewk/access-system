import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('authUser');
        if (stored) {
            setCurrentUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const authenticate = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
    };

    const disconnect = () => {
        setCurrentUser(null);
        localStorage.removeItem('authUser');
    };

    return (
        <UserContext.Provider value={{ currentUser, authenticate, disconnect, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUserContext must be used within provider');
    return ctx;
};