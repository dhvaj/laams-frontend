import type { User } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim();





export const authService = {
  login: async (email: string, password?: string): Promise<{ user?: User; token?: string; requirePasswordSetup?: boolean; userId?: string; email?: string }> => {
    // Instant zero-latency demo access with all profiles unlocked
    if (email && email.toLowerCase() === 'demo@demo.com') {
      const allowed = ['password123', 'demo123', 'password', 'demo', 'Welcome@123'];
      if (allowed.includes(password || '')) {
        const demoUser: User = {
          id: 'bbdfd838-e804-4ba8-ad0b-fd7db6a67f44',
          username: 'demo_student',
          firstName: 'Demo',
          lastName: 'Student',
          email: 'demo@demo.com',
          role: 'student',
          profileId: 'typical',
          gradeLevel: '10',
          classId: undefined,
          preferredLanguage: 'en',
          linkedStudentIds: []
        };
        const demoToken = 'mock-jwt-token-for-1';
        localStorage.setItem('laams_jwt_token', demoToken);
        localStorage.setItem('laams_user_data', JSON.stringify(demoUser));
        localStorage.setItem('token', demoToken);
        return { user: demoUser, token: demoToken };
      }
    }

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
    if (data.requirePasswordSetup) {
      return data;
    }
    
    localStorage.setItem('laams_jwt_token', data.token);
    localStorage.setItem('laams_user_data', JSON.stringify(data.user));
    return { user: data.user, token: data.token };
  },
  setupPassword: async (userId: string, password?: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/users/setup-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to setup password');
    }

    const data = await response.json();
    localStorage.setItem('laams_jwt_token', data.token);
    localStorage.setItem('laams_user_data', JSON.stringify(data.user));
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
