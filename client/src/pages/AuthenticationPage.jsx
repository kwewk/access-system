import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { api } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';

const AuthenticationPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: ''
    });
    const { authenticate } = useUserContext();
    const navigate = useNavigate();

    const debouncedEmail = useDebounce(credentials.email, 500);
    const debouncedPassword = useDebounce(credentials.password, 500);

    useEffect(() => {
        if (debouncedEmail.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(debouncedEmail)) {
                setValidationErrors(prev => ({
                    ...prev,
                    email: 'Please enter a valid email address'
                }));
            } else {
                setValidationErrors(prev => ({ ...prev, email: '' }));
            }
        }
    }, [debouncedEmail]);

    useEffect(() => {
        if (debouncedPassword.length > 0) {
            if (debouncedPassword.length < 6) {
                setValidationErrors(prev => ({
                    ...prev,
                    password: 'Password must contain at least 6 characters'
                }));
            } else {
                setValidationErrors(prev => ({ ...prev, password: '' }));
            }
        }
    }, [debouncedPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const performLogin = async () => {
        setErrorMsg('');
        setIsProcessing(true);

        try {
            const response = await api.login(credentials.email, credentials.password);
            authenticate(response.user, response.token);

            switch (response.user.role) {
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
        } catch (error) {
            setErrorMsg(error.message || 'Incorrect email or password');
        } finally {
            setIsProcessing(false);
        }
    };

    const throttledLogin = useThrottle(performLogin, 2000);

    const handleLogin = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isProcessing) return;

        const hasErrors = Object.values(validationErrors).some(error => error !== '');
        if (hasErrors) {
            setErrorMsg('Please fix all validation errors before submitting');
            return;
        }

        if (!credentials.email || !credentials.password) {
            setErrorMsg('Please fill in all fields');
            return;
        }

        throttledLogin();
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

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="your.email@example.com"
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                validationErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <p className="font-semibold mb-2">Test data:</p>
                    <p>SuperAdmin: sa@example.com / admin123</p>
                    <p>Admin: a1@example.com / admin123</p>
                    <p>User: u1@example.com / user123</p>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationPage;