import { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import UsersList from '../components/UsersList';
import { mockUsers } from '../data/mockUsers';

const UserPage = () => {
    const [userList] = useState(mockUsers);

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

                <UsersList users={userList} />
            </div>
        </div>
    );
};

export default UserPage;