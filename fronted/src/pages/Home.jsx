import React, { useContext } from "react";
import Hero from "./miniComponents/Hero.jsx";
import About from "./miniComponents/About.jsx";
import Contact from "./miniComponents/Contact.jsx";
import Navbar from "./miniComponents/Navbar.jsx";
import Footer from "./miniComponents/Footer.jsx";
import { ThemeContext } from "../context/ThemeContext.js"; 

const Home = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`transition-all duration-500 min-h-screen ${
      darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Navbar is inside the themed div so it inherits the context easily */}
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Home;