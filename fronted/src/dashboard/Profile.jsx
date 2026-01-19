import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaPhone, FaUserAlt, FaEnvelope } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/profile`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className={`max-w-md mx-auto rounded-[2.5rem] overflow-hidden transition-all duration-500 transform hover:scale-[1.01] border ${
        darkMode 
          ? "bg-slate-900 border-slate-800 shadow-2xl shadow-blue-900/20" 
          : "bg-white border-slate-100 shadow-xl shadow-slate-200"
      }`}>
        
        {/* Decorative Top Banner */}
        <div className="h-28 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        <div className="px-8 pb-12">
          {/* Avatar Section */}
          <div className="flex flex-col items-center -mt-14 relative z-10">
            <img
              src={user?.avatar?.url || "https://via.placeholder.com/150"}
              alt="Profile"
              className={`w-28 h-28 rounded-full object-cover border-4 shadow-2xl transition-all duration-500 ${
                darkMode ? "border-slate-900" : "border-white"
              }`}
            />
            <h3 className={`text-2xl font-black mt-4 tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              {user?.fullName}
            </h3>
            <span className="px-3 py-1 mt-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest">
              {user?.role || "Member"}
            </span>
          </div>

          {/* Info Sections */}
          <div className="mt-10 space-y-3">
            {/* Email Field */}
            <div className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? "bg-slate-800/40" : "bg-slate-50/80"}`}>
              <FaEnvelope className="text-blue-500 shrink-0" />
              <div className="overflow-hidden">
                <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Email Address</p>
                <p className={`text-sm font-medium truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{user?.email}</p>
              </div>
            </div>

            {/* Phone Field */}
            <div className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? "bg-slate-800/40" : "bg-slate-50/80"}`}>
              <FaPhone className="text-blue-500 shrink-0" />
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Phone Number</p>
                <p className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{user?.phone || "Not linked"}</p>
              </div>
            </div>

            {/* Bio Field */}
            <div className={`flex items-start gap-4 p-4 rounded-2xl ${darkMode ? "bg-slate-800/40" : "bg-slate-50/80"}`}>
              <FaUserAlt className="text-blue-500 shrink-0 mt-1" />
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Professional Bio</p>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {user?.aboutMe || "This user prefers to keep their bio a mystery."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Socials */}
          <div className="mt-10 pt-8 border-t border-dashed border-slate-700/30">
            <div className="flex justify-center gap-5">
              {[
                { icon: <FaInstagram />, link: user?.instagramURL, brand: "hover:text-pink-500" },
                { icon: <FaTwitter />, link: user?.twitterURL, brand: "hover:text-blue-400" },
                { icon: <FaLinkedin />, link: user?.linkedInURL, brand: "hover:text-blue-700" },
                { icon: <FaFacebook />, link: user?.facebookURL, brand: "hover:text-blue-800" },
              ].map((social, i) => social.link && (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xl transition-all duration-300 transform hover:scale-125 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  } ${social.brand}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;