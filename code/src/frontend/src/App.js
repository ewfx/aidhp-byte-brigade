import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";  // New admin login page
import AdminDashboard from "./pages/AdminDashboard";  // New admin dashboard page


const Main = () => {
  const navigate = useNavigate();

  const btnlogin = {backgroundColor: '#d71e28',borderRadius:'24px',maxHeight:'40px',maxWidth:'100%',minWidth:'176px',font: '15px Arial'}

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Welcome to ByteBrigade Recommendation Engine</h1>
      <div>
        <button className="w-half bg-red-500 text-white p-2 rounded" style={btnlogin} onClick={() => navigate("/customer-login")}>Customer Login</button>
      </div>
      <div>
        <button className="w-half bg-red-500 text-white p-2 rounded" style={btnlogin} onClick={() => navigate("/banker-login")}>Banker Login</button>
      </div>
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
