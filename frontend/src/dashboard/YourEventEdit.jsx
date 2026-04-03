import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const YourEventEdit = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    duration: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BASE_URL}/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvent({
          title: data.title || "",
          description: data.description || "",
          startDateTime: data.startDateTime || "",
          endDateTime: data.endDateTime || "",
          duration: data.duration || "",
        });
      } catch (err) {
        setError("Failed to load event details.");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/event/update/${eventId}`, event, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Error updating event. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Event</h2>

        {loading ? (
          <p className="text-gray-600">Loading event details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <label className="block text-gray-700 font-medium">Title:</label>
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md mb-3"
            />

            <label className="block text-gray-700 font-medium">Description:</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md mb-3"
            />

            <label className="block text-gray-700 font-medium">Start Time:</label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={event.startDateTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md mb-3"
            />

            <label className="block text-gray-700 font-medium">End Time:</label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={event.endDateTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md mb-3"
            />

            <label className="block text-gray-700 font-medium">Duration (hh:mm):</label>
            <input
              type="text"
              name="duration"
              value={event.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md mb-3"
              placeholder="e.g., 02:30"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Return to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YourEventEdit;
