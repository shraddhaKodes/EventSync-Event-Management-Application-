import React, { useState } from "react";
import axios from "axios";
import LocationPicker from "./LocationPicker";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    privacy: "Public",
    medium: "Online",
    startDateTime: "",
    endDateTime: "",
    language: "",
    maxParticipants: 1,
    category: "All",
    termsAndConditions: "",
    locationName: "",
    latitude: "",
    longitude: "",
    acceptingRSVPs: true,
    featureImage: null,
    isPaid: false,
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 File input
  const handleFileChange = (e) => {
    setFormData({ ...formData, featureImage: e.target.files[0] });
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // ✅ Append all fields EXCEPT duration & userId
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        `${BASE_URL}/event/create`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // JWT cookie
        }
      );

      alert("✅ Event created successfully!");
      console.log(response.data);

      // 🔄 Reset form
      setFormData({
        title: "",
        description: "",
        privacy: "Public",
        medium: "Online",
        startDateTime: "",
        endDateTime: "",
        language: "",
        maxParticipants: 1,
        category: "All",
        termsAndConditions: "",
        locationName: "",
        latitude: "",
        longitude: "",
        acceptingRSVPs: true,
        featureImage: null,
        isPaid: false,
        price: "",
      });

    } catch (error) {
      console.error("❌ Error creating event:", error.response?.data || error);

      setError(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Privacy */}
        <select name="privacy" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        {/* Medium */}
        <select name="medium" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Online">Online</option>
          <option value="In Person">In Person</option>
        </select>

        {/* 📍 Location Picker */}
        {formData.medium === "In Person" && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Click on map to select location
            </p>

            <LocationPicker setFormData={setFormData} />

            {formData.locationName && (
              <p className="text-sm text-green-600">
                📍 Selected: {formData.locationName}
              </p>
            )}
          </div>
        )}

        {/* Date & Time */}
        <input
          type="datetime-local"
          name="startDateTime"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="datetime-local"
          name="endDateTime"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Language */}
        <input
          type="text"
          name="language"
          placeholder="Language"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Participants */}
        <input
          type="number"
          name="maxParticipants"
          min="1"
          placeholder="Max Participants"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Category */}
        <select name="category" onChange={handleChange} className="w-full p-2 border rounded">
          {[
            "All", "Music", "Games", "Sports", "Arts", "Film",
            "Literature", "Technology", "Culture", "Lifestyle",
            "Charity", "Fashion", "Kids", "Other"
          ].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Terms */}
        <textarea
          name="termsAndConditions"
          placeholder="Terms and Conditions"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* RSVP */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="acceptingRSVPs"
            checked={formData.acceptingRSVPs}
            onChange={handleChange}
          />
          <span>Accepting RSVPs</span>
        </label>

        {/* Paid Event */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleChange}
          />
          <span>Is this a paid event?</span>
        </label>

        {formData.isPaid && (
          <input
            type="number"
            name="price"
            placeholder="Enter Price"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        )}

        {/* Image */}
        <input
          type="file"
          name="featureImage"
          onChange={handleFileChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>

      </form>
    </div>
  );
};

export default Create;