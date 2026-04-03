import React, { useState } from "react";
import axios from "axios";
import LocationPicker from "./LocationPicker";
import { ThemeContext } from "../context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Create = () => {
  const { darkMode } = React.useContext(ThemeContext);
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

 const inputStyle = `w-full p-2 rounded-lg border outline-none transition 
${darkMode 
  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500" 
  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`;

return (
  <div
    className={`max-w-2xl mx-auto p-6 mt-6 rounded-xl shadow-lg transition-all duration-300
    ${darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}
  >
    <h2 className="text-2xl font-bold mb-6">Create Event</h2>

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Event Title"
        onChange={handleChange}
        required
        className={inputStyle}
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        required
        className={inputStyle}
      />

      {/* Privacy */}
      <select name="privacy" onChange={handleChange} className={inputStyle}>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>

      {/* Medium */}
      <select name="medium" onChange={handleChange} className={inputStyle}>
        <option value="Online">Online</option>
        <option value="In Person">In Person</option>
      </select>

      {/* Location */}
      {formData.medium === "In Person" && (
        <div className="space-y-2">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Click on map to select location
          </p>

          <div className="rounded-lg overflow-hidden">
            <LocationPicker setFormData={setFormData} />
          </div>

          {formData.locationName && (
            <p className="text-sm text-green-500">
              📍 Selected: {formData.locationName}
            </p>
          )}
        </div>
      )}

      {/* Date */}
      <input type="datetime-local" name="startDateTime" onChange={handleChange} required className={inputStyle} />
      <input type="datetime-local" name="endDateTime" onChange={handleChange} className={inputStyle} />

      {/* Language */}
      <input type="text" name="language" placeholder="Language" onChange={handleChange} required className={inputStyle} />

      {/* Participants */}
      <input type="number" name="maxParticipants" min="1" placeholder="Max Participants" onChange={handleChange} required className={inputStyle} />

      {/* Category */}
      <select name="category" onChange={handleChange} className={inputStyle}>
        {[
          "All","Music","Games","Sports","Arts","Film",
          "Literature","Technology","Culture","Lifestyle",
          "Charity","Fashion","Kids","Other"
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
        className={inputStyle}
      />

      {/* Toggles */}
      <div className="flex flex-col gap-3">

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="acceptingRSVPs" checked={formData.acceptingRSVPs} onChange={handleChange} />
          <span>Accepting RSVPs</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
          <span>Paid Event</span>
        </label>

      </div>

      {/* Price */}
      {formData.isPaid && (
        <input
          type="number"
          name="price"
          placeholder="Enter Price"
          onChange={handleChange}
          required
          className={inputStyle}
        />
      )}

      {/* Image */}
      <input
        type="file"
        name="featureImage"
        onChange={handleFileChange}
        required
        className={inputStyle}
      />

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 rounded-lg font-semibold transition-all
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Creating Event..." : "Create Event"}
      </button>

    </form>
  </div>
);
};

export default Create;