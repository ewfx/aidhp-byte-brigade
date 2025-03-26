import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bankers from "../data/bankers";

const AdminLogin = ({ setBanker }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const btnlogin = {backgroundColor: '#d71e28',borderRadius:'24px',maxHeight:'40px',maxWidth:'100%',minWidth:'176px'}

  const handleLogin = (e) => {
    e.preventDefault();

    const banker = bankers.find((u) => u.username === username && u.password === password);

    console.log(banker)


    if (banker) {
      setBanker(banker); // Save banker info
      navigate("/banker-home"); // Redirect to Banker Home
    } else {
      setError("Invalid username or password.");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Banker Login</h2>
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
          <div>
            <button className="w-full bg-red-500 text-white p-2 rounded hover:bg-blue-600" style={btnlogin}>
              Login
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;