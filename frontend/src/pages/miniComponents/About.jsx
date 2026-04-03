import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaUsers, FaClock, FaChartBar } from "react-icons/fa";
import Event from "../../assets/Event.avif";
import { ThemeContext } from "../../context/ThemeContext.js";
const About = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`w-full py-20 px-6 sm:px-12 lg:px-24 transition-colors ${darkMode ? "bg-slate-900" : "bg-white"}`} id="about">
      <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        
        {/* Modern Image Container */}
        <motion.div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img src={Event} alt="Event" className="relative rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
        </motion.div>

        <div>
          <h2 className={`text-4xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Why Choose <span className="text-blue-500">EventSync?</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <FaCalendarCheck />, title: "Scheduling", color: "text-yellow-500" },
              { icon: <FaUsers />, title: "Attendees", color: "text-blue-500" },
              { icon: <FaClock />, title: "Real-time", color: "text-green-500" },
              { icon: <FaChartBar />, title: "Analytics", color: "text-purple-500" },
            ].map((feature, i) => (
              <div key={i} className={`p-6 rounded-2xl border transition-all ${
                darkMode ? "bg-slate-800 border-slate-700 hover:border-blue-500" : "bg-slate-50 border-slate-200 hover:border-blue-500"
              }`}>
                <div className={`${feature.color} text-2xl mb-3`}>{feature.icon}</div>
                <h4 className="font-bold">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;