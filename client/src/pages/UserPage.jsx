import { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import UsersList from '../components/UsersList';
import { api } from '../services/api';

const UserPage = () => {
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const users = await api.getUsers();
            setUserList(users);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavigationBar />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationBar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        User panel
                    </h2>
                    <p className="text-gray-600">Users list view</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <UsersList users={userList} />
            </div>
        </div>
    );
};

export default UserPage;