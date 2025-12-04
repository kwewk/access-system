import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const UsersList = ({ users, onRemove, onRoleUpdate, canDelete, canChangeRole }) => {
    const [selectedRoles, setSelectedRoles] = useState({});

    const handleRoleSelection = (userId, newRole, currentRole) => {
        if (newRole !== currentRole && window.confirm(`Change role to ${newRole}?`)) {
            onRoleUpdate(userId, newRole);
        }
    };

    const roleStyles = {
        superadmin: 'bg-purple-100 text-purple-700 border-purple-300',
        admin: 'bg-blue-100 text-blue-700 border-blue-300',
        user: 'bg-green-100 text-green-700 border-green-300'
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                        {(canDelete || canChangeRole) && (
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {users.map((user) => {
                        const userCanDelete = canDelete && canDelete(user);
                        const userCanChangeRole = canChangeRole && canChangeRole(user);

                        return (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    {userCanChangeRole ? (
                                        <select
                                            value={selectedRoles[user.id] || user.role}
                                            onChange={(e) => {
                                                const newRole = e.target.value;
                                                setSelectedRoles({ ...selectedRoles, [user.id]: newRole });
                                                handleRoleSelection(user.id, newRole, user.role);
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleStyles[user.role]} cursor-pointer`}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${roleStyles[user.role]}`}>
                        {user.role}
                      </span>
                                    )}
                                </td>
                                {(canDelete || canChangeRole) && (
                                    <td className="px-6 py-4">
                                        {userCanDelete ? (
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete user ${user.name}?`)) {
                                                        onRemove(user.id);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm">—</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;