import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";  // New admin login page
import AdminDashboard from "./pages/AdminDashboard";  // New admin dashboard page

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Welcome to ByteBrigade Recommendation Engine</h1>
      <button className="w-half bg-blue-500 text-white p-2 rounded" onClick={() => navigate("/customer-login")}>Customer Login</button>
      <button className="w-half bg-blue-500 text-white p-2 rounded" onClick={() => navigate("/banker-login")}>Banker Login</button>
    </div>
  );
};

function App() {
  const [customer, setCustomer] = useState(null);
  const [banker, setBanker] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Customer Login and Home Routes */}
        <Route path="/" element={<Main /> }/>
        <Route path="/customer-login" element={<Login setCustomer={setCustomer} />} />
        <Route path="/customer-home" element={<Home customer={customer} setCustomer={setCustomer} />} />

        {/* Banker Login and Banker Dashboard Routes */}
        <Route path="/banker-login" element={<AdminLogin setBanker={setBanker} />} />
        <Route path="/banker-home" element={<AdminDashboard banker={banker} setBanker={setBanker} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
