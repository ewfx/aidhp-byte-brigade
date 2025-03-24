import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters, AiOutlineQrcode } from "react-icons/ai";
import { QRCodeCanvas } from "qrcode.react";

const Home = ({ customer, setCustomer }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [qrVisible, setQrVisible] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      navigate("/");
      return;
    }

    axios
      .post("http://127.0.0.1:5000/recommend", { customer_id: customer.customer_id })
      .then((response) => {
        setRecommendations(response.data.recommendations || []);
      })
      .catch((error) => console.error("Error fetching recommendations:", error));
  }, [customer, navigate]);

  const handleLogout = () => {
    setCustomer(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
        <h1 className="text-2xl font-semibold">Welcome, {customer?.name} 👋</h1>
        <button
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 shadow-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔥 Recommended Products for You
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((item, index) => (
              <div
                key={index}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 p-4"
              >
                <img
                  src={item.image_link}
                  alt={item.product_name}
                  className="w-full h-52 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{item.product_name}</h3>
                  <p className="text-gray-600">{item.product_type}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <a
                      href={item.purchase_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      Buy Now 🚀
                    </a>
                    
                    {/* QR Code Button */}
                    <button
                      onClick={() => setQrVisible(qrVisible === index ? null : index)}
                      className="text-gray-700 hover:text-blue-600 text-2xl"
                    >
                      <AiOutlineQrcode />
                    </button>
                  </div>
                </div>

                {/* QR Code Popup on the Tile */}
                {qrVisible === index && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                    <div className="relative">
                      {/* Close Button */}
                      <button
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        onClick={() => setQrVisible(null)}
                      >
                        ✖
                      </button>
                      <QRCodeCanvas value={item.purchase_link} size={120} />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 flex justify-center items-center">
              <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;