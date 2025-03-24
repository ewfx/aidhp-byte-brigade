import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";  // New admin login page
import AdminDashboard from "./pages/AdminDashboard";  // New admin dashboard page

function App() {
  const [customer, setCustomer] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));

  return (
    <Router>
      <Routes>
        {/* Customer Login and Home Routes */}
        <Route path="/" element={<Login setCustomer={setCustomer} />} />
        <Route path="/home" element={<Home customer={customer} setCustomer={setCustomer} />} />

        {/* Admin Login and Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLogin setAdminToken={setAdminToken} />} />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard adminToken={adminToken} setAdminToken={setAdminToken} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
