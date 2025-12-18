import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import "./Campus.css";
import Footer from "./components/Footer.jsx";

// Campus Component
const Campus = ({ onNavigate, currentPage }) => {
  const [activeTab, setActiveTab] = useState("courses");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["All Categories", "Blockchain", "Smart Contracts", "DeFi", "NFTs", "DAO", "Security"];

  const courses = [
    {
      id: 1,
      title: "Introduction to Blockchain",
      instructor: "Dr. Sarah Chen",
      category: "Blockchain",
      students: 342,
      price: "0.5 ARCANA",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Smart Contract Development with Solidity",
      instructor: "Prof. Alex Rodriguez",
      category: "Smart Contracts",
      students: 289,
      price: "1.2 ARCANA",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "DeFi Advanced Strategies",
      instructor: "Dr. James Park",
      category: "DeFi",
      students: 156,
      price: "2.5 ARCANA",
      level: "Advanced",
    },
    {
      id: 4,
      title: "NFT Development & Minting",
      instructor: "Emma Thompson",
      category: "NFTs",
      students: 421,
      price: "0.8 ARCANA",
      level: "Beginner",
    },
    {
      id: 5,
      title: "DAO Governance & Leadership",
      instructor: "Dr. Michael Zhang",
      category: "DAO",
      students: 198,
      price: "1.5 ARCANA",
      level: "Intermediate",
    },
    {
      id: 6,
      title: "Web3 Security & Auditing",
      instructor: "Prof. Lisa Anderson",
      category: "Security",
      students: 234,
      price: "2.0 ARCANA",
      level: "Advanced",
    },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "level-beginner";
      case "Intermediate":
        return "level-intermediate";
      case "Advanced":
        return "level-advanced";
      default:
        return "";
    }
  };

  return (
    <div className="campus-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />

      <main className="campus-content">
        {/* Hero Section */}
        <div className="campus-hero">
          <h1 className="campus-title">Explore Our Campus</h1>
          <p className="campus-description">Discover courses, connect with expert lecturers, and engage with our vibrant community of learners and mentors.</p>

          {/* Search Bar */}
          <div className="search-container">
            <input type="text" placeholder="Search courses, lecturers, or members..." className="search-input" />
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category, index) => (
              <button key={index} className={`category-btn ${index === 0 && activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory(category.toLowerCase())}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === "courses" ? "active" : ""}`} onClick={() => setActiveTab("courses")}>
            Courses ( 6 )
          </button>
          <button className={`tab-btn ${activeTab === "lecturers" ? "active" : ""}`} onClick={() => setActiveTab("lecturers")}>
            Lecturers ( 5 )
          </button>
          <button className={`tab-btn ${activeTab === "community" ? "active" : ""}`} onClick={() => setActiveTab("community")}>
            Community ( 6 )
          </button>
        </div>

        {/* Courses Grid */}
        {activeTab === "courses" && (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <span className={`course-level ${getLevelColor(course.level)}`}>{course.level}</span>
                </div>

                <p className="course-instructor">{course.instructor}</p>

                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{course.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Students:</span>
                    <span className="meta-value">{course.students}</span>
                  </div>
                </div>

                <div className="course-footer">
                  <span className="course-price">{course.price}</span>
                  <button className="enroll-btn">Enroll</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Campus;
