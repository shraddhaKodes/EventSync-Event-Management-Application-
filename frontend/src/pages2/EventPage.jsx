import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Navbar from "../pages/miniComponents/Navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.js"; // Added Context

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const categories = [
  "All", "Music", "Games", "Sports", "Arts", "Film", "Literature", 
  "Technology", "Culture", "Lifestyle", "Charity", "Fashion", "Kids", "Other"
];
const eventFilters = ["All", "Offline Events", "Online Events"];

const EventPage = () => {
  const navigate = useNavigate(); 
  const { darkMode } = useContext(ThemeContext); // Use theme state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let url = `${BASE_URL}/event/getall`;
        let params = new URLSearchParams();

        if (selectedCategory !== "All") params.append("category", selectedCategory);
        if (selectedFilter === "Offline Events") params.append("medium", "In Person");
        else if (selectedFilter === "Online Events") params.append("medium", "Online");

        if (params.toString()) url += `?${params.toString()}`;

        const response = await axios.get(url);
        setEvents(response.data.events || []);
      } catch (err) {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedCategory, selectedFilter]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollCategory = (direction) => {
    if (categoryRef.current) {
      categoryRef.current.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 pt-24">
        {/* Page Header */}
        <div className="text-center py-6">
          <h1 className={`text-4xl font-black ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            Explore Events
          </h1>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} mt-2`}>
            Discover experiences tailored just for you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search for your next experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all shadow-sm ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 focus:border-blue-500 text-white" 
                  : "bg-white border-slate-200 focus:border-blue-500 text-slate-900 shadow-slate-200"
              }`}
            />
          </div>
        </div>

        {/* Category & Filters Container */}
        <div className={`p-6 rounded-3xl border transition-all ${
          darkMode ? "bg-slate-900 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
        }`}>
          {/* Category Slider */}
          <div className="relative flex items-center mb-6">
            <button 
              onClick={() => scrollCategory("left")} 
              className={`absolute left-0 p-2 rounded-full z-10 transition ${
                darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div
              ref={categoryRef}
              className="flex space-x-3 overflow-x-scroll scrollbar-hide px-10 py-1 whitespace-nowrap scroll-smooth"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? (darkMode ? "bg-blue-500 text-white" : "bg-blue-600 text-white shadow-md") 
                      : (darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600")
                  } hover:scale-105`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button 
              onClick={() => scrollCategory("right")} 
              className={`absolute right-0 p-2 rounded-full z-10 transition ${
                darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Event Type Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {eventFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                  selectedFilter === filter 
                    ? "border-blue-500 bg-blue-500/10 text-blue-500" 
                    : (darkMode ? "border-slate-800 text-slate-500 hover:border-slate-700" : "border-slate-200 text-slate-400 hover:border-slate-300")
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Events Display */}
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 font-bold">{error}</p>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div 
                  key={event._id} 
                  className={`rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 border ${
                    darkMode 
                      ? "bg-slate-900 border-slate-800 hover:shadow-2xl hover:shadow-blue-900/20" 
                      : "bg-white border-slate-100 shadow-xl shadow-slate-200 hover:shadow-2xl"
                  }`}
                >
                  <div className="relative group">
                    <img 
                      src={event.featureImage?.url} 
                      alt={event.title} 
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                        event.privacy === "Public" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}>
                        {event.privacy}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-blue-500 text-xs font-black uppercase tracking-tighter mb-2">
                      {new Date(event.startDateTime).toDateString()}
                    </p>
                    <h2 className="text-xl font-black mb-3 leading-tight">{event.title}</h2>
                    <p className={`text-sm mb-6 line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {event.description}
                    </p>
                    
                    <button 
                      onClick={() => navigate(`/events/${event._id}`)} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                    >
                      View Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">No events matched your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;