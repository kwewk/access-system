import { useState, useEffect, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import UsersList from '../components/UsersList';
import UserStats from '../components/UserStats';
import AddUserModal from '../components/AddUserModal';
import { api } from '../services/api';
import { useThrottle } from '../hooks/useThrottle';

const AdminPage = () => {
    const [userList, setUserList] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const users = await api.getUsers();
            setUserList(users);
        } catch (err) {
            showNotification(err.message || 'Failed to load users', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const performDelete = useCallback(async (userId) => {
        try {
            await api.deleteUser(userId);
            setUserList(prevUsers => prevUsers.filter(u => u.id !== userId));
            showNotification('User successfully deleted', 'success');
        } catch (err) {
            showNotification(err.message || 'Failed to delete user', 'error');
        }
    }, []);

    const handleRemove = useThrottle(performDelete, 1000);

    const handleUserAdded = () => {
        loadUsers();
        showNotification('User successfully added', 'success');
    };

    const canDelete = (targetUser) => {
        return targetUser.role === 'user';
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                            Admin panel
                        </h2>
                        <p className="text-gray-600">View and delete users with the User role.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                <UserStats />

                {notification.message && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                    }`}>
                        <p className={notification.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                            {notification.message}
                        </p>
                    </div>
                )}

                <UsersList
                    users={userList}
                    onRemove={handleRemove}
                    canDelete={canDelete}
                />
            </div>

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserAdded={handleUserAdded}
                allowedRoles={['user']}
            />
        </div>
    );
};

export default AdminPage;