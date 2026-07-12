import type { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';





export const authService = {
  login: async (email: string, password?: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Invalid email or password');
    }
    
    const data = await response.json();
    return { user: data.user, token: data.token };
  },
  getCurrentUser: async (token: string): Promise<User | null> => {
    try {
      let userId = token.replace('mock-jwt-token-for-', '');
      if (token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
      }
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Failed to get current user', e);
    }
    return null;
  },
  register: async (userData: Omit<User, 'id'> & { password?: string }): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create account');
    }

    const createdUser = await response.json();
    return {
      user: createdUser,
      token: `mock-jwt-token-for-${createdUser.id}`
    };
  }
};
