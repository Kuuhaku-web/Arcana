import "./App.css";
import { useState } from "react";
import Home from "./Home.jsx";
import Campus from "./Campus.jsx";
import Stake from "./Stake.jsx";

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    console.log("Navigating to:", page);
    setCurrentPage(page);

    // Update URL hash manual
    if (page === "home") window.location.hash = "";
    else window.location.hash = page;

    // Scroll to top
    window.scrollTo(0, 0);
  };
  return (
    <>
      {currentPage === "home" && <Home onNavigate={handleNavigate} currentPage={currentPage} />}
      {currentPage === "campus" && <Campus onNavigate={handleNavigate} currentPage={currentPage} />}
      {currentPage === "stake" && <Stake onNavigate={handleNavigate} currentPage={currentPage} />}
    </>
  );
};

export default App;
