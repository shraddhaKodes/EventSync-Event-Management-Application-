import React, { useContext } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaCalendarCheck, FaArrowUp } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext.js";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`w-full pt-16 pb-8 px-6 sm:px-12 transition-colors duration-500 border-t ${
      darkMode 
      ? "bg-slate-950 text-white border-slate-800" 
      : "bg-white text-slate-900 border-slate-200"
    }`}>
      
      <div className="max-w-7xl mx-auto">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <FaCalendarCheck className="text-blue-500 text-3xl" />
              <h2 className="text-2xl font-black tracking-tighter">EventSync</h2>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Simplifying the way you plan, track, and execute events globally. Join thousands of creators today.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-500">Platform</h4>
            <ul className={`space-y-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              <li className="hover:text-blue-500 cursor-pointer transition">Events</li>
              <li className="hover:text-blue-500 cursor-pointer transition">Ticketing</li>
              <li className="hover:text-blue-500 cursor-pointer transition">Analytics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-500">Company</h4>
            <ul className={`space-y-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              <li className="hover:text-blue-500 cursor-pointer transition">About Us</li>
              <li className="hover:text-blue-500 cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-blue-500 cursor-pointer transition">Terms of Service</li>
            </ul>
          </div>

          {/* Newsletter/Social */}
          <div className="space-y-4">
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-500">Socials</h4>
            <div className="flex gap-4">
              {[
                { icon: <FaLinkedin />, link: "https://linkedin.com/in/shraddhakodes" },
                { icon: <FaGithub />, link: "https://github.com/shraddhakodes" },
                { icon: <FaTwitter />, link: "https://twitter.com/shraddhakodes" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all ${
                    darkMode ? "bg-slate-900 hover:bg-blue-600" : "bg-slate-100 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
          darkMode ? "border-slate-800" : "border-slate-100"
        }`}>
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} EventSync. Developed by <span className="text-blue-500">Shraddha Kumari</span>
          </p>
          
          <button 
            onClick={scrollToTop}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-tighter hover:text-blue-500 transition-all`}
          >
            Back to top <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;