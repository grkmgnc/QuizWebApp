import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import AdminPrivateRoute from "./AdminPrivateRoute";
import UserPrivateRoute from "./UserPrivateRoute";
import Register from './Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
        <Route path="/user-dashboard" element={<UserPrivateRoute><UserDashboard /></UserPrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
