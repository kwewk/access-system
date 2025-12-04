import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { mockUsers } from '../data/mockUsers';

const AuthenticationPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { authenticate } = useUserContext();
    const navigate = useNavigate();

    const handleLogin = () => {
        setErrorMsg('');
        setIsProcessing(true);

        setTimeout(() => {
            const foundUser = mockUsers.find(
                u => u.email === credentials.email && u.password === credentials.password
            );

            if (foundUser) {
                authenticate(foundUser);

                switch (foundUser.role) {
                    case 'superadmin':
                        navigate('/superadmin');
                        break;
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'user':
                        navigate('/user');
                        break;
                    default:
                        navigate('/user');
                }
            } else {
                setErrorMsg('Incorrect email or password');
            }
            setIsProcessing(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                    <p className="text-gray-500 mt-2">Enter your credentials</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={isProcessing}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Logging in...' : 'Login'}
                    </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <p className="font-semibold mb-2">Test data:</p>
                    <p>SuperAdmin: sa@example.com / admin123</p>
                    <p>Admin: a1/a2@example.com / admin123</p>
                    <p>User: u1/u2@example.com / user123</p>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationPage;