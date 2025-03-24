import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [customer, setCustomer] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setCustomer={setCustomer} />} />
        <Route path="/home" element={<Home customer={customer} setCustomer={setCustomer} />} />
      </Routes>
    </Router>
  );
}

export default App;
