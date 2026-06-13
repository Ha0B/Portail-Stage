import api from './api';

const authService = {

  // Login
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login', loginData);

      console.log('LOGIN RESPONSE :', response.data);

      // Sauvegarde du token
      localStorage.setItem('token', response.data.token);

      // Sauvegarde de l'utilisateur complet (contient l'id, le username, les roles, ....)
      localStorage.setItem('user', JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error('Login error :', error);
      throw error;
    }
  },

  // Register
  register: async (registerData) => {
    try {
      const response = await api.post('/auth/register', registerData);
      return response.data;
    } catch (error) {
      console.error('Register error :', error);
      throw error;
    }
  },

  // Get current user anonyme 
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Parse user error :', error);
      return null;
    }
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check auth
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.clear(); 
  }
};

export default authService;