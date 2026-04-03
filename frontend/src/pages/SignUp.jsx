import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aboutMe: "",
    password: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });

    // Show image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/user/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Signup Successful:", data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-black mb-6 drop-shadow-lg">Create an Account</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <textarea
            name="aboutMe"
            placeholder="Tell us about yourself"
            value={formData.aboutMe}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          ></textarea>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />

          {/* Avatar Upload with Preview */}
          <div className="w-full flex flex-col items-center space-y-3">
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full shadow-md" />
            )}
            <label className="w-full p-3 flex items-center justify-center bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-all shadow-lg">
              Upload Avatar
              <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all shadow-lg"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:block md:w-1/2 bg-cover bg-center rounded-lg shadow-xl"
        style={{ backgroundImage: 'url("/login_img2.avif")' }}
      ></motion.div>
    </div>
  );
};

export default SignUp;
