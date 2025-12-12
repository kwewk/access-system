import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const UserStats = () => {
    const [stats, setStats] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadStats = async () => {
        setIsRefreshing(true);
        setError(null);

        try {
            const data = await api.getUserStats();
            setStats(data);
            setIsLoaded(true);
        } catch (err) {
            setError(err.message || 'Failed to load statistics');
            setIsLoaded(true);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (!isLoaded) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading statistics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <p className="text-red-700">Error: {error}</p>
                    <button
                        onClick={loadStats}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">User Statistics</h3>
                <button
                    onClick={loadStats}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Users</p>
                            <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Super Admins</p>
                            <p className="text-3xl font-bold mt-2">{stats?.byRole?.superadmin || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Admins</p>
                            <p className="text-3xl font-bold mt-2">{stats?.byRole?.admin || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Users</p>
                            <p className="text-3xl font-bold mt-2">{stats?.byRole?.user || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {stats?.lastUpdated && (
                <p className="text-sm text-gray-500 mt-4 text-right">
                    Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                </p>
            )}
        </div>
    );
};

export default UserStats;