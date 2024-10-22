import React from 'react';
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/app" 
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default Root;
