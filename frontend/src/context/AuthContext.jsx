import { createContext, useCallback, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  // Save logged-in user and token
  const saveAuth = (userData, authToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);

    setUser(userData);
    setToken(authToken);
  };

  // Login with email + password
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      const resData = response.data;

      const loggedInUser = resData.user || resData.data;
      const authToken = resData.token || resData.access_token;

      if (!authToken) {
        throw new Error('No authentication token received from server.');
      }

      saveAuth(loggedInUser, authToken);

      return loggedInUser;
    } catch (error) {
      console.error(
        'Login error:',
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // Register
  const register = async (
    name,
    email,
    password,
    passwordConfirmation
  ) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        passwordConfirmation: passwordConfirmation,
      });

      const resData = response.data;

      const newUser = resData.user || resData.data;
      const newToken = resData.token || resData.access_token;

      if (newUser && newToken) {
        saveAuth(newUser, newToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // Update user
  const updateUser = useCallback((u) => {
    setUser(u);

    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        setUser: updateUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

