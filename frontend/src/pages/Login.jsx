import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-body");
    return () => document.body.classList.remove("login-body");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await axios.post(`${BASE_URL}/user/login`, 
        { email, password }, 
        { withCredentials: true }
      );
  
      console.log("Login Response:", res); // Debugging
  
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        console.log("Token stored:", localStorage.getItem("token"));
        navigate("/dashboard");
      } else {
        console.error("No token received in response!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900">
      {/* Login Form Container */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-xl"
      >
        <h2 className="text-4xl font-bold text-blue-400 mb-6 drop-shadow-lg">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
          />

          {/* Forgot Password Link */}
          <p
            className="text-sm text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/password/forgot")}
          >
            Forgot Password?
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {/* Signup Button with Bounce Effect */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.2 } }}
            onClick={() => navigate("/signup")}
            className="w-full py-3 mt-2 border border-blue-400 text-blue-400 font-semibold rounded-md hover:bg-blue-500 hover:text-white transition-all shadow-lg"
          >
            Create an Account
          </motion.button>
        </form>
      </motion.div>

      {/* Background Image Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:block md:w-1/2 bg-cover bg-center rounded-lg shadow-xl"
        style={{ backgroundImage: 'url("/login_inner.jpg")' }}
      ></motion.div>
    </div>
  );
};

export default Login;
