import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import "./Campus.css";
import Footer from "./components/Footer.jsx";

// Campus Component
const Campus = ({ onNavigate, currentPage }) => {
  const [activeTab, setActiveTab] = useState("courses");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const lecturers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialization: "Blockchain & Cryptography",
      bio: "PhD in Computer Science from MIT with 10+ years in blockchain research.",
      rating: 4.9,
      courses: 3,
      students: 892,
    },
    {
      id: 2,
      name: "Prof. Alex Rodriguez",
      specialization: "Smart Contracts & Solidity",
      bio: "Former Ethereum core developer. Teaching blockchain since 2015.",
      rating: 4.8,
      courses: 5,
      students: 1204,
    },
    {
      id: 3,
      name: "Dr. James Park",
      specialization: "DeFi & Tokenomics",
      bio: "Founder of multiple DeFi protocols. Expert in protocol design.",
      rating: 4.7,
      courses: 4,
      students: 756,
    },
    {
      id: 4,
      name: "Emma Thompson",
      specialization: "NFT & Web3 Design",
      bio: "NFT artist and developer. Created 6 successful NFT collections.",
      rating: 4.9,
      courses: 2,
      students: 634,
    },
    {
      id: 5,
      name: "Dr. Michael Zhang",
      specialization: "DAO Governance",
      bio: "Political scientist turned blockchain expert. Advises multiple DAOs.",
      rating: 4.6,
      courses: 3,
      students: 512,
    },
  ];

  const communityMembers = [
    {
      id: 1,
      name: "Alice Kumar",
      role: "Active Student",
      reputation: 245,
      tags: ["Blockchain", "Smart Contracts"],
      joined: "Jan 2024",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Mentor",
      reputation: 512,
      tags: ["DeFi", "DAO Governance"],
      joined: "Aug 2023",
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Active Student",
      reputation: 189,
      tags: ["NFTs", "Web3 Design"],
      joined: "Mar 2024",
    },
    {
      id: 4,
      name: "David Lee",
      role: "Course Creator",
      reputation: 678,
      tags: ["Security", "Advanced Dev"],
      joined: "Jul 2023",
    },
    {
      id: 5,
      name: "Sofia Martinez",
      role: "Active Student",
      reputation: 156,
      tags: ["Blockchain", "NFTs"],
      joined: "Feb 2024",
    },
    {
      id: 6,
      name: "Raj Patel",
      role: "Mentor",
      reputation: 445,
      tags: ["Smart Contracts", "DeFi"],
      joined: "Sep 2023",
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
            <input type="text" placeholder="Search courses, lecturers, or members..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
            {courses
              .filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((course) => (
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

        {/* Lecturers Grid */}
        {activeTab === "lecturers" && (
          <div className="lecturers-grid">
            {lecturers.map((lecturer) => (
              <div key={lecturer.id} className="lecturer-card">
                <h3 className="lecturer-name">{lecturer.name}</h3>
                <p className="lecturer-specialization">{lecturer.specialization}</p>
                <p className="lecturer-bio">{lecturer.bio}</p>

                <div className="lecturer-stats">
                  <div className="stat-row">
                    <span className="stat-label">Rating:</span>
                    <span className="stat-values">
                      <span className="star">⭐</span> {lecturer.rating}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Courses:</span>
                    <span className="stat-values">{lecturer.courses}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Students:</span>
                    <span className="stat-values">{lecturer.students}</span>
                  </div>
                </div>

                <button className="view-courses-btn">View Courses</button>
              </div>
            ))}
          </div>
        )}

        {/* Community Grid */}
        {activeTab === "community" && (
          <div className="community-grid">
            {communityMembers.map((member) => (
              <div key={member.id} className="community-card">
                <div className="community-header">
                  <h3>{member.name}</h3>
                  <span className={`role ${member.role.toLowerCase().replace(" ", "-")}`}>{member.role}</span>
                </div>

                <div className="reputation">
                  <p className="label">Reputation Score</p>
                  <p className="score">{member.reputation}</p>
                </div>

                <div className="tags">
                  {member.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="joined">Joined {member.joined}</p>
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
