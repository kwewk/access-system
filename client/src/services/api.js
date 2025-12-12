const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const api = {
    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    async register(username, email, password, role = 'user') {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    async getUsers() {
        const response = await fetch(`${API_URL}/users`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch users');
        }

        return response.json();
    },

    async getUserStats() {
        const response = await fetch(`${API_URL}/users/stats`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch user statistics');
        }

        return response.json();
    },

    async deleteUser(userId) {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete user');
        }

        return response.json();
    },

    async updateUserRole(userId, newRole) {
        const response = await fetch(`${API_URL}/users/${userId}/role`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ newRole })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update role');
        }

        return response.json();
    }
};