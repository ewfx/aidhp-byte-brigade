import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users";

const Login = ({ setCustomer }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      setCustomer(user); // Save user info
      navigate("/customer-home"); // Redirect to Home
    } else {
      setError("Invalid username or password.");
    }
  };

  const btnlogin = {backgroundColor: '#d71e28',borderRadius:'24px',maxHeight:'40px',maxWidth:'100%',minWidth:'176px',font: '15px Arial'}

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login to Portal</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
          <div>
            <button className="w-full bg-red-500 text-white p-2 rounded hover:bg-blue-600" style={btnlogin} onClick={handleLogin}>
              Login
            </button>
          </div>
        
      </div>
    </div>
  );
};

export default Login;