import { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import UsersList from '../components/UsersList';
import { mockUsers } from '../data/mockUsers';

const AdminPage = () => {
    const [userList, setUserList] = useState(mockUsers);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleRemove = (userId) => {
        setUserList(userList.filter(u => u.id !== userId));
        showNotification('User successfully deleted', 'success');
    };

    const canDelete = (targetUser) => {
        return targetUser.role === 'user';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavigationBar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        Admin panel
                    </h2>
                    <p className="text-gray-600">View and delete users with the User role.</p>
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
                    canDelete={canDelete}
                />
            </div>
        </div>
    );
};

export default AdminPage;