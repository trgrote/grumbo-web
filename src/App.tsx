import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CharacterSheet from './components/CharacterSheet';
import CreateCharacter from './components/CreateCharacter';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/character/new" 
        element={
          <ProtectedRoute>
            <CreateCharacter />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/character/:id" 
        element={
          <ProtectedRoute>
            <CharacterSheet />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/character/:id/edit" 
        element={
          <ProtectedRoute>
            <CharacterSheet />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
      
      {/* Default Route */}
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
        } 
      />
      
      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
        } 
      />
    </Routes>
  );
}

export default App;
