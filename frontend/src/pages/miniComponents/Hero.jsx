import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.js";
const Hero = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 transition-colors duration-500">
      {/* Dynamic Background Pattern */}
      <div className={`absolute inset-0 opacity-10 ${darkMode ? "bg-[radial-gradient(#3b82f6_1px,transparent_1px)]" : "bg-[radial-gradient(#000_1px,transparent_1px)]"} [background-size:20px_20px]`}></div>

      <div className="relative z-10 max-w-4xl space-y-8">
        <p className={`inline-block px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-sm border ${
          darkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-blue-600"
        }`}>
          🚀 Elevate Your Events with EventSync
        </p>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
          Seamlessly Manage <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
            Your Global Events
          </span>
        </h1>

        <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          The all-in-one platform to track, manage, and scale your events with real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
            onClick={() => navigate("/signup")}
          >
            Get Started Free
          </button>
          <button
            className={`px-8 py-4 font-bold rounded-xl border transition-all ${
              darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100"
            }`}
            onClick={() => document.getElementById('about').scrollIntoView({behavior: 'smooth'})}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero;