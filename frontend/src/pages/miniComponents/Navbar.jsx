import React, { useState, useContext, useEffect } from "react";
import { FaMoon, FaSun, FaBars, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.js";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => setDarkMode(!darkMode);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <>
      {/* 1. Main Navbar Wrapper - High Z-Index */}
      <nav
        className={`fixed top-0 left-0 w-full z-[100] backdrop-blur-md px-6 py-4 transition-all duration-300 border-b ${
          darkMode 
            ? "bg-slate-950/80 text-white border-slate-800 shadow-xl" 
            : "bg-white/80 text-slate-900 border-slate-200 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <FaCalendarAlt className="text-3xl text-blue-600" />
            <span>EventSync</span>
          </Link>

          {/* Desktop Items */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 font-bold text-sm uppercase tracking-widest">
              {user ? (
                <>
                  <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
                  <li><Link to="/events" className="hover:text-blue-500 transition-colors">Events</Link></li>
                  <li><Link to="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link></li>
                </>
              ) : (
                ["Home", "About", "Contact"].map((item) => (
                  <li key={item}><a href={`#${item.toLowerCase()}`} className="hover:text-blue-500 transition-colors">{item}</a></li>
                ))
              )}
            </ul>
          </div>

          {/* Right Section Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                darkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <button onClick={handleLogout} className="hidden md:block px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hidden md:block px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition">
                Login
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMenuOpen(true)} 
              className="md:hidden text-2xl p-2 rounded-lg hover:bg-slate-500/10"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Mobile Menu Overlay - Higher Z-Index than Navbar */}
      <div 
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* 3. Mobile Menu Drawer - Highest Z-Index */}
      <div className={`fixed top-0 right-0 w-[300px] h-full z-[120] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      } ${darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
        
        <div className="flex justify-between items-center p-6 border-b border-slate-700/10">
           <span className="font-black tracking-tighter text-xl text-blue-600">EventSync</span>
           <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-500/10">
             <FaTimes className="text-xl" />
           </button>
        </div>

        <ul className="flex flex-col p-8 gap-6 text-lg font-bold">
          {user ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-500">Home</Link>
              <Link to="/events" onClick={() => setMenuOpen(false)} className="hover:text-blue-500">Events</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-500">Dashboard</Link>
              <div className="mt-4 pt-6 border-t border-slate-700/10">
                <button onClick={handleLogout} className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-black">Logout</button>
              </div>
            </>
          ) : (
            <>
              <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
              <div className="mt-4 pt-6 border-t border-slate-700/10">
                <Link to="/login" className="block text-center bg-blue-600 text-white py-3.5 rounded-2xl font-black" onClick={() => setMenuOpen(false)}>Login</Link>
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;