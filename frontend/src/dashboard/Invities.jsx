import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Invities = () => {
  const [confirmedEvents, setConfirmedEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfirmedEvents = async () => {
      try {
         const token = localStorage.getItem("token");
               if (!token) throw new Error("No token found. Please log in again.");
       
               const decodedToken = jwtDecode(token);
               const receiverId = decodedToken.id?.trim();

        if (!token || !receiverId) throw new Error("Missing token or user ID.");

        const response = await axios.get(`${BASE_URL}/rsvp/confirmed/events/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        setConfirmedEvents(response.data);
      } catch (error) {
        console.error("Error fetching confirmed events:", error);
        setError(error.response?.data?.message || "Failed to fetch events.");
      }
    };

    fetchConfirmedEvents();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Confirmed Invitations</h2>

      {error && <p className="text-red-500">⚠️ {error}</p>}

      {confirmedEvents.length === 0 ? (
        <p className="text-gray-500">No confirmed invitations</p>
      ) : (
        <ul className="space-y-4">
          {confirmedEvents.map((rsvp) => {
            const { senderId, eventId } = rsvp;
            return (
              <li key={rsvp._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">{senderId?.fullName || "Someone"}</span>{" "}
                  get confirmation for RSVP <br/>
                  <span className="text-blue-500">{senderId?.email || "Someone"}</span>{" "} 
                  <br/>
                  <b>Event : </b>
                  <span className="text-blue-600">{eventId?.title || "an event"}</span>.
                </p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(eventId?.startDateTime).toLocaleString() || "TBA"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Invities;
