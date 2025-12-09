import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('authUser');
        const token = localStorage.getItem('authToken');
        if (stored && token) {
            setCurrentUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const authenticate = (userData, token) => {
        setCurrentUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
    };

    const disconnect = () => {
        setCurrentUser(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
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
