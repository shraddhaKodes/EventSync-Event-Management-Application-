import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const YourEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/event/my_events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.response?.data?.message || "Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Handle Delete Function
  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/event/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove event from UI after successful deletion
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="flex items-center bg-white p-4 rounded-lg shadow-md"
            >
              {/* Event Image (Left) */}
              <img
                src={event.featureImage?.url}
                alt={event.title}
                className="w-16 h-16 object-cover rounded-lg"
              />

              {/* Event Details (Middle) */}
              <div
                className="ml-4 flex-1 cursor-pointer"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-gray-600">{event.date}</p>
                <p className="text-sm">{event.description}</p>
              </div>

              {/* Edit & Delete Icons (Right) */}
              <div className="flex gap-3">
                <button onClick={() => navigate(`/event/${event._id}`)}>
                  <FaEdit className="text-blue-500 hover:text-blue-700 text-lg" />
                </button>
                <button onClick={() => handleDelete(event._id)}>
                  <FaTrash className="text-red-500 hover:text-red-700 text-lg" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourEvent;
