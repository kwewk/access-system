import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationPage from './pages/AuthenticationPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import SuperAdminPage from './pages/SuperAdminPage';
import ForbiddenPage from './pages/ForbiddenPage';

function App() {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route path="/auth" element={<AuthenticationPage />} />

                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                                <UserPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/superadmin"
                        element={
                            <ProtectedRoute allowedRoles={['superadmin']}>
                                <SuperAdminPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/forbidden" element={<ForbiddenPage />} />
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    );
}

export default App;