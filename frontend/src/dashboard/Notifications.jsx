import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ThemeContext } from "../context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Notifications = () => {
   const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [pendingRSVPs, setPendingRSVPs] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchPendingRSVPs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const decodedToken = jwtDecode(token);
        const receiverId = decodedToken.id?.trim();
        setUserId(receiverId);

        if (!receiverId) throw new Error("Invalid receiverId extracted from token.");

        const url = `${BASE_URL}/rsvp/pending/${receiverId}`;
        console.log("Fetching data from:", url);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        const responseData = response.data.rsvps || [];
        if (Array.isArray(responseData)) {
          setPendingRSVPs(responseData);
        } else {
          console.error("Unexpected response format", response.data);
          setPendingRSVPs([]);
        }
      } catch (error) {
        console.error("Error fetching pending RSVPs:", error);
        setError(error.response?.data?.message || error.message);
        setPendingRSVPs([]);
      }
    };

    fetchPendingRSVPs();
  }, []);

  const handleAccept = async (rsvpId) => {
    try {
      const token = localStorage.getItem("token");
  
      await axios.put(
        `${BASE_URL}/rsvp/confirm/${rsvpId}`,
        { confirm: true },  // ✅ Fix: Send `confirm: true`
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // ✅ Fix: Ensure UI updates correctly
      setPendingRSVPs((prev) => prev.filter((rsvp) => rsvp._id !== rsvpId));
    } catch (error) {
      console.error("Error accepting RSVP:", error);
      setError(error.response?.data?.message || error.message);
    }
  };
  
  // ❌ Handle Decline RSVP
  const handleDecline = async (rsvpId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/rsvp/decline/${rsvpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRSVPs(pendingRSVPs.filter((rsvp) => rsvp._id !== rsvpId));
    } catch (error) {
      console.error("Error declining RSVP:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

 return (
  <div
    className={`max-w-lg mx-auto mt-6 p-6 rounded-xl shadow-md transition-all duration-300
    ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
  >
    <h2 className="text-xl font-semibold mb-4">
      Pending RSVP Requests
    </h2>

    {error && (
      <p className="text-red-500">⚠️ {error}</p>
    )}

    {pendingRSVPs.length === 0 ? (
      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        No RSVP Requests
      </p>
    ) : (
      <ul className="space-y-4">
        {pendingRSVPs
          .filter(
            (rsvp) =>
              rsvp.senderId?._id !== userId &&
              rsvp.eventId?.organizerId !== userId
          )
          .map((rsvp) => {
            const sender = rsvp.senderId;
            const senderName = sender?.fullName || "Someone";
            const senderAvatar = sender?.avatar?.url;

            return (
              <li
                key={rsvp._id}
                className={`flex items-center p-4 rounded-lg shadow-sm transition
                ${darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white text-lg font-bold mr-3">
                  {senderAvatar ? (
                    <img
                      src={senderAvatar}
                      alt={`${senderName}'s Avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{senderName.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <p>
                    <span className="font-semibold">{senderName}</span>{" "}
                    sent RSVP request to{" "}
                    <span className="font-semibold">
                      {rsvp.eventId?.title || "an event"}
                    </span>
                  </p>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    📅{" "}
                    {new Date(
                      rsvp.eventId?.startDateTime
                    ).toLocaleString() || "TBA"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    className="text-green-500 hover:text-green-400"
                    onClick={() => handleAccept(rsvp._id)}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-400"
                    onClick={() => handleDecline(rsvp._id)}
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    )}
  </div>
);
};

export default Notifications;
