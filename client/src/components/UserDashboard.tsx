import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {currentUser?.email}</h1>
    </div>
  );
};

export default UserDashboard;
