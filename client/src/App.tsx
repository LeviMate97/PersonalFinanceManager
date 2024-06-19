import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Drawer from './components/Drawer';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import Transactions from './components/Transactions';
import Accounts from './components/Accounts';
import AddTransaction from './components/AddTransaction';
import EditTransaction from './components/EditTransaction';
import ManageCategories from './components/ManageCategories';
import AddAccount from './components/AddAccount';
import EditAccount from './components/EditAccount';
import { CssBaseline, Box } from '@mui/material';
import CryptoPrice from './components/Crypto';
import GamePrices from './components/GamePrices';
import ChatBot from './components/ChatBot';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const drawerWidth = 240;

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <></>; 
  }

  return currentUser ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Drawer />
          <Box
            component="main"
            sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)` }}
          >
            <Routes>
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
              <Route path="/accounts" element={<ProtectedRoute element={<Accounts />} />} />
              <Route path="/add-transaction/:type" element={<ProtectedRoute element={<AddTransaction />} />} />
              <Route path="/edit-transaction/:id" element={<ProtectedRoute element={<EditTransaction />} />} />
              <Route path="/manage-categories" element={<ProtectedRoute element={<ManageCategories />} />} />
              <Route path="/add-account" element={<ProtectedRoute element={<AddAccount />} />} />
              <Route path="/edit-account/:id" element={<ProtectedRoute element={<EditAccount />} />} />
              <Route path="/crypto" element={<ProtectedRoute element={<CryptoPrice />} />} />
              <Route path="/game-prices" element={<ProtectedRoute element={<GamePrices />} />} />
              <Route path="/chat-bot" element={<ProtectedRoute element={<ChatBot />} />} />

              <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
