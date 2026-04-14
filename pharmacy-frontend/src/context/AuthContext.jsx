import React, { createContext, useContext, useState } from 'react';
import { loginApi, signupApi } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem('pharmacy_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('pharmacy_token', data.access_token);
    localStorage.setItem('pharmacy_user', JSON.stringify(data.user));
    setUserState(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await signupApi(name, email, password);
    localStorage.setItem('pharmacy_token', data.access_token);
    localStorage.setItem('pharmacy_user', JSON.stringify(data.user));
    setUserState(data.user);
    return data.user;
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('pharmacy_token');
    localStorage.removeItem('pharmacy_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
