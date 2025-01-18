import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users from localStorage when the app starts
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [
      {
        id: '1',
        email: 'nitishshukla260@gmail.com',
        password: 'password',
        role: 'employee',
        name: 'Nitish Shukla',
        leaveBalance: {
          vacation: 15,
          sick: 10,
          personal: 5,
        },
      },
      {
        id: '2',
        email: 'warmbier260@gmail.com',
        password: 'password',
        role: 'manager',
        name: 'Warmbier',
      },
    ];
    setUsers(storedUsers);
  }, []);

  // Save users to localStorage whenever the user list changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const register = async (email, password, name, role) => {
    if (!email || !password || !name || !role) {
      throw new Error('All fields are required');
    }

    // Check if user already exists
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: String(users.length + 1),
      email,
      password,
      name,
      role,
      leaveBalance:
        role === 'employee'
          ? { vacation: 15, sick: 10, personal: 5 }
          : null,
    };

    // Add new user to the state
    setUsers((prevUsers) => [...prevUsers, newUser]);

    return newUser;
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Fetch a user's details by ID
  const getUserById = (id) => {
    return users.find((user) => user.id === id) || null;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    users, // Expose users for manager to access
    getUserById, // Utility to fetch user details by ID
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
