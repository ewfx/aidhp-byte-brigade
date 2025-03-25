import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = ({ banker, setBanker }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!banker) {
      navigate("/banker-login");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/getUsers")
      .then((response) => setCustomers(response.data || []))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCustomers([]);
      })
      .finally(() => setLoading(false));
  }, [banker, navigate]);

  const handleLogout = () => {
    setBanker(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <h1 className="text-2xl font-semibold tracking-wide">Banker Dashboard</h1>
        <button
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Recommendations</h2>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-solid"></div>
          </div>
        ) : customers.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left">
                  <th className="p-4 text-lg font-semibold border-b border-gray-300">Customer ID</th>
                  <th className="p-4 text-lg font-semibold border-b border-gray-300">Clip Image Match</th>
                  <th className="p-4 text-lg font-semibold border-b border-gray-300">Purchase History</th>
                  <th className="p-4 text-lg font-semibold border-b border-gray-300">Interests</th>
                  <th className="p-4 text-lg font-semibold border-b border-gray-300">Engagement Score</th>
                  <th className="p-4 text-lg font-semibold border-b border-gray-300">Recommendations</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    key={customer.customer_id}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="p-4 text-gray-800 font-medium">{customer.customer_id}</td>
                    <td className="p-4 text-gray-700">{customer.clip_image_match}</td>
                    <td className="p-4 text-gray-700">{customer.purchase_history}</td>
                    <td className="p-4 text-gray-700">{customer.interests}</td>
                    <td className="p-4 text-gray-700">{customer.engagement_score}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-4">
                        {customer.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="w-40 min-w-[160px] border p-3 rounded-lg shadow-sm bg-gray-50 flex flex-col items-center text-center"
                          >
                            {/* Image on Top */}
                            {rec.image_link !== "Not Available" && (
                              <img
                                src={rec.image_link}
                                alt={rec.product_name}
                                className="w-full h-24 object-cover rounded-lg shadow-md"
                              />
                            )}

                            {/* Product Name */}
                            <p className="mt-2 font-semibold text-gray-900">
                              {rec.product_name}
                            </p>

                            {/* Product Type (in brackets) */}
                            <p className="text-sm text-gray-500">
                              ({rec.product_type})
                            </p>

                            {/* Buy Now Button */}
                            {rec.purchase_link !== "Not Available" ? (
                              <a
                                href={rec.purchase_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                              >
                                Buy Now
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm mt-2">N/A</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;