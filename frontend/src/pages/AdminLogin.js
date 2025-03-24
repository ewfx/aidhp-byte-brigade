import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setAdminToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the entered credentials match the hardcoded ones
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // On successful login, set a dummy admin token (could be JWT in real scenarios)
      const token = "adminToken"; // Simple hardcoded token
      localStorage.setItem("adminToken", token);
      setAdminToken(token);
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;