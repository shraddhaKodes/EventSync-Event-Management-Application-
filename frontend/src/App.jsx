import React, { useState, useEffect } from "react"; // Added React and useEffect
import { Routes, Route } from "react-router-dom"; // Removed BrowserRouter/Router
import Home from "./pages/Home";
import Login from "./pages/Login" ;
import SignUp from "./pages/SignUp";
import StockContext from "./context/StockContext";
import { ThemeContext } from "./context/ThemeContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EventPage from "./pages2/EventPage";
import EventView from "./pages2/Eventview";
import Dashboard from "./dashboard/Dashboard"; 
import YourEventEdit from "./dashboard/YourEventEdit";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [stockSymbol, setStockSymbol] = useState("MSFT");

  // Effect to handle dark mode background
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#111827"; 
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#111827";
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
        {/* REMOVED <Router> FROM HERE */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/events/:eventId" element={<EventView />} />
          <Route path="/event/:eventId" element={<YourEventEdit />} />
        </Routes>
        {/* REMOVED </Router> FROM HERE */}
      </StockContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;