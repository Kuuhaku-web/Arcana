import "./App.css";
import { useState } from "react";
import Home from "./Home.jsx";
import Campus from "./Campus.jsx";

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    console.log("Navigating to:", page);
    setCurrentPage(page);

    // Update URL hash manual
    if (page === "home") window.location.hash = "";
    else window.location.hash = page;
  };
  return (
    <>
      {currentPage === "home" && <Home onNavigate={handleNavigate} />}
      {currentPage === "campus" && <Campus onNavigate={handleNavigate} />}
    </>
  );
};

export default App;
