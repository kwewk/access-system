import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
                <Lock className="w-24 h-24 mx-auto text-red-500 mb-6" />
                <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Access denied</h2>
                <p className="text-gray-600 mb-8">You have no rights for viewing this page</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Return
                </button>
            </div>
        </div>
    );
};

export default ForbiddenPage;