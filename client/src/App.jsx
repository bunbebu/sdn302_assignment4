import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import QuizDetail from './components/QuizDetail';
import AdminDashboard from './components/AdminDashboard';
import AdminQuizDetail from './components/AdminQuizDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/quiz/:id" 
          element={
            <PrivateRoute>
              <QuizDetail />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/quiz/:id" 
          element={
            <PrivateRoute adminOnly={true}>
              <AdminQuizDetail />
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
