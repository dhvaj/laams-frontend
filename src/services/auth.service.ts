import type { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const demoUsers: User[] = [
  {
    id: "1",
    firstName: "Aarav",
    lastName: "Patel",
    email: "student@school.edu",
    role: "student",
    profileId: "dyslexic",
    gradeLevel: "8"
  },
  {
    id: "2",
    firstName: "Arjun",
    lastName: "Sharma",
    email: "teacher@school.edu",
    role: "teacher"
  },
  {
    id: "3",
    firstName: "System",
    lastName: "Admin",
    email: "admin@laams.edu",
    role: "admin"
  },
  {
    id: "4",
    firstName: "Rahul",
    lastName: "Patel",
    email: "parent@home.com",
    role: "parent"
  }
];

const findDemoUserByEmail = (email: string) => {
  return demoUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const authService = {
  login: async (email: string, password?: string): Promise<{ user: User; token: string }> => {
    try {
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
    } catch (e) {
      console.warn('Login failed or API unavailable', e);
      // Fallback for demo purposes if backend is down
      const demoUser = findDemoUserByEmail(email);
      if (demoUser) return { user: demoUser, token: `mock-jwt-token-for-${demoUser.id}` };
      throw e;
    }
  },
  getCurrentUser: async (token: string): Promise<User | null> => {
    try {
      // Decode JWT to get user ID
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
    const id = Date.now().toString(); // Generate simple ID for mock
    const newUser = { ...userData, id };

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const createdUser = await response.json();
      return {
        user: createdUser,
        token: `mock-jwt-token-for-${createdUser.id}`
      };
    } catch (e) {
      console.warn('Mock API unavailable, simulating registration', e);
      return {
        user: newUser as User,
        token: `mock-jwt-token-for-${newUser.id}`
      };
    }
  }
};
