import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaUserFriends,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Create from "./Create";
import Profile from "./Profile";
import YourEvent from "./YourEvent"; 
import Notifications from "./Notifications";
import Invities from "./Invities";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInvitiesPage, setShowInvitiesPage] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 text-gray-600 z-50"
        onClick={() => setIsOpen(true)}
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md flex flex-col p-5 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative`}
      >
        {/* Close Button for Mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes className="text-2xl" />
        </button>

        <Link to="/" className="text-3xl font-extrabold flex items-center gap-2">
          <FaCalendarAlt className="text-4xl text-blue-600" />
          <span>EventSync</span>
        </Link>

        <nav className="flex-1 mt-8">
          <ul className="space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer"
            >
              <FaHome /> <span>Home</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer"
            >
              <FaCalendarAlt /> <span>Events</span>
            </Link>
            <li
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                setShowInvitiesPage(true);
                setShowNotifications(false);
                setShowCreatePage(false);
                setShowProfilePage(false);
                setIsOpen(false);
              }}
            >
              <FaUserFriends /> <span>Invites</span>
            </li>
            <li
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                setShowNotifications(true);
                setShowCreatePage(false);
                setShowProfilePage(false);
                setShowInvitiesPage(false);
                setIsOpen(false);
              }}
            >
              <FaBell /> <span>Notifications</span>
            </li>
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="mt-auto">
          <div
            className="text-gray-700 flex items-center space-x-2 cursor-pointer hover:text-blue-500"
            onClick={() => {
              setShowProfilePage(true);
              setShowCreatePage(false);
              setShowNotifications(false);
              setShowInvitiesPage(false);
              setIsOpen(false);
            }}
          >
            <span>👤 User Profile</span>
          </div>
          <button
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 mt-4"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 min-h-screen">
        {showCreatePage ? (
          <Create onClose={() => setShowCreatePage(false)} />
        ) : showProfilePage ? (
          <Profile onClose={() => setShowProfilePage(false)} />
        ) : showNotifications ? (
          <Notifications />
        ) : showInvitiesPage ? (
          <Invities />
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 mt-9">Your Events</h1>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 mt-2 sm:mt-0"
                onClick={() => {
                  setShowCreatePage(true);
                  setShowProfilePage(false);
                  setShowNotifications(false);
                  setShowInvitiesPage(false);
                }}
              >
                + Create
              </button>
            </div>

            {/* Search Bar */}
            <div className="w-full bg-gray-200 p-3 rounded-lg mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* Event List */}
            <div className="bg-white p-5 rounded-lg shadow-md flex-1">
              <YourEvent />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
