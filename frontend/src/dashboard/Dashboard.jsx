import React, { useState, useContext } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaUserFriends,
  FaBell,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Create from "./Create";
import Profile from "./Profile";
import YourEvent from "./YourEvent";
import Notifications from "./Notifications";
import Invities from "./Invities";
import { ThemeContext } from "../context/ThemeContext";

const Dashboard = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("events"); // events, create, profile, notifications, invities
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const sidebarLinks = [
    { name: "Home", icon: <FaHome />, page: "events" },
    { name: "Invites", icon: <FaUserFriends />, page: "invities" },
    { name: "Notifications", icon: <FaBell />, page: "notifications" },
  ];

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-md flex flex-col p-5 z-50
        transition-transform duration-300
        ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative`}
      >
        {/* Mobile Close Button */}
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-600"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold flex items-center gap-2"
        >
          <FaCalendarAlt className="text-4xl text-blue-500" />
          <span>EventSync</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 mt-8">
          <ul className="space-y-4">
            {sidebarLinks.map((link) => (
              <li
                key={link.name}
                className={`flex items-center space-x-2 cursor-pointer hover:text-blue-500 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
                onClick={() => {
                  setCurrentPage(link.page);
                  setIsSidebarOpen(false);
                }}
              >
                {link.icon} <span>{link.name}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer: Profile, Theme Toggle, Logout */}
        <div className="mt-auto space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer hover:text-blue-500"
            onClick={() => setCurrentPage("profile")}
          >
            <span>👤 Profile</span>
            <button onClick={toggleTheme}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <button
            className="flex items-center space-x-2 text-red-500 hover:text-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 text-gray-600 z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 min-h-screen">
        {currentPage === "create" && <Create onClose={() => setCurrentPage("events")} />}
        {currentPage === "profile" && <Profile onClose={() => setCurrentPage("events")} />}
        {currentPage === "notifications" && <Notifications />}
        {currentPage === "invities" && <Invities />}
        {currentPage === "events" && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1
                className={`text-2xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Your Events
              </h1>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 mt-2 sm:mt-0"
                onClick={() => setCurrentPage("create")}
              >
                + Create
              </button>
            </div>

            {/* Search Bar */}
            <div
              className={`w-full p-3 rounded-lg mb-4 ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* Events List */}
            <div
              className={`p-5 rounded-lg shadow-md flex-1 overflow-auto ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <YourEvent />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;