import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../pages/miniComponents/Navbar";
import { ThemeContext } from "../context/ThemeContext.js"; // Import ThemeContext
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventView = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { darkMode } = useContext(ThemeContext); // Access theme state

  useEffect(() => {
    fetch(`${BASE_URL}/event/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  const handleRSVP = async (eventId, receiverId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/rsvp/${eventId}`,
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send RSVP!");
    }
  };

  if (!event) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-slate-950" : "bg-slate-50"
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-500 min-h-screen pb-12 ${
      darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28">
        {/* Main Event Card */}
        <div className={`rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 ${
          darkMode ? "bg-slate-900 border-slate-800 shadow-blue-900/10" : "bg-white border-slate-100 shadow-slate-200"
        }`}>
          
          {/* Header Image Section */}
          <div className="relative h-[450px]">
            <img
              src={event.featureImage?.url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mt-3 leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Left Column: Description & Metadata */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                    About the Event
                  </h3>
                  <p className={`text-lg leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {event.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Date & Time", icon: "📅", val: new Date(event.startDateTime).toLocaleString() },
                    { label: "Location", icon: "📍", val: event.locationName || "Virtual Location" },
                    { label: "Platform/Medium", icon: "🌍", val: event.medium },
                    { label: "Privacy", icon: "🔒", val: event.privacy }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${
                      darkMode ? "bg-slate-800/40 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {item.icon} {item.label}
                      </p>
                      <p className="font-bold text-sm">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Actions Sticky Card */}
              <div className="lg:col-span-1">
                <div className={`sticky top-32 p-8 rounded-[2rem] border space-y-4 ${
                  darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="text-center mb-6">
                    <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Registration Status
                    </p>
                    <p className="text-2xl font-black text-blue-500 mt-1">Open Now</p>
                  </div>

                  <button
                    onClick={() => handleRSVP(event._id, event.userId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]"
                  >
                    Confirm RSVP
                  </button>

                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`You're Invited: ${event.title}`);
                      const body = encodeURIComponent(`Check out this event: ${event.title}\n\nLink: ${window.location.href}`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className={`w-full py-4 font-black rounded-2xl border transition-all ${
                      darkMode 
                        ? "border-slate-700 text-slate-300 hover:bg-slate-700" 
                        : "border-slate-300 text-slate-600 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    Share Invitation
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventView;