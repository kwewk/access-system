import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import UsersList from '../components/UsersList';
import { api } from '../services/api';
import { useThrottle } from '../hooks/useThrottle';

const SuperAdminPage = () => {
    const { currentUser } = useUserContext();
    const [userList, setUserList] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

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

    const performRoleChange = useCallback(async (userId, newRole) => {
        try {
            await api.updateUserRole(userId, newRole);
            setUserList(prevUsers => prevUsers.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
            showNotification(`Role was changed to ${newRole}`, 'success');
        } catch (err) {
            showNotification(err.message || 'Failed to update role', 'error');
        }
    }, []);

    const handleRemove = useThrottle(performDelete, 1000);
    const handleRoleUpdate = useThrottle(performRoleChange, 1000);

    const canDelete = (targetUser) => {
        return targetUser.id !== currentUser.id && targetUser.role !== 'superadmin';
    };

    const canChangeRole = (targetUser) => {
        return targetUser.id !== currentUser.id && targetUser.role !== 'superadmin';
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
                        Super Admin panel
                    </h2>
                    <p className="text-gray-600">Full access: user management and role changes.</p>
                </div>

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
                    onRoleUpdate={handleRoleUpdate}
                    canDelete={canDelete}
                    canChangeRole={canChangeRole}
                />
            </div>
        </div>
    );
};

export default SuperAdminPage;