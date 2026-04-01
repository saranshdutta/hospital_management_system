import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage, or default to null
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem('pharmacy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUserState(userData);
    localStorage.setItem('pharmacy_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('pharmacy_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
