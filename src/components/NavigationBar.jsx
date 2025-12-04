import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { useUserContext } from '../context/UserContext';

const NavigationBar = () => {
    const { currentUser, disconnect } = useUserContext();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        disconnect();
        navigate('/auth');
    };

    const roleColors = {
        superadmin: 'bg-purple-600',
        admin: 'bg-blue-600',
        user: 'bg-green-600'
    };

    return (
        <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Access Control</h1>
                    </div>

                    {currentUser && (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition"
                            >
                                <div className="text-right">
                                    <div className="font-semibold">{currentUser.name}</div>
                                    <div className={`text-xs px-2 py-0.5 rounded ${roleColors[currentUser.role]} inline-block`}>
                                        {currentUser.role}
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 flex items-center gap-2 transition"
                                    >
                                        <LogOut className="w-4 h-4 text-red-600" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;