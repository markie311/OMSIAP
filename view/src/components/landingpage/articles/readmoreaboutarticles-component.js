"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import "../../../styles/landingpage/articles/readmoreaboutarticles.scss"

import NavBar from "../../navbar/navbar/navbar-component.js";
import Footer from "../footer/footer-component.js";

export default function BlogPage() {
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState("")
  const [animatedElements, setAnimatedElements] = useState([])
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Placeholder images - replace with your actual image paths
  const headerImage = "../images/landingpage/articles/blog.jpg"
  const blogImage1 = "../images/landingpage/articles/omsiapwebsite.png"
  const blogImage2 = "../images/market/products/lighter.jpg"
  const blogImage3 = "../images/market/products/lighter.jpg"

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      image: blogImage1,
      date: "Jan 28, 2024",
      title: "OMSIAP's website platform launched",
      description:
        "As technology continues to evolve at a rapid pace, businesses must stay ahead of the curve to remain competitive. In this post, we explore the latest trends in business technology that are set to revolutionize industries and drive growth in the coming years.",
    }
  ]

  // Enhanced topics with summaries
  const topics = [
    {
      name: "Business Strategy",
      summary:
        "Explore frameworks and methodologies for developing effective business strategies that drive growth and competitive advantage in today's dynamic market environment.",
      relatedArticles: 12,
      icon: "📊",
    },
    {
      name: "Technology Trends",
      summary:
        "Stay updated with the latest technological innovations and trends shaping industries, from AI and machine learning to blockchain and IoT applications.",
      relatedArticles: 24,
      icon: "💻",
    },
    {
      name: "Digital Marketing",
      summary:
        "Discover cutting-edge digital marketing strategies, tools, and best practices to reach your target audience and maximize ROI across various online channels.",
      relatedArticles: 18,
      icon: "📱",
    },
    {
      name: "Leadership",
      summary:
        "Learn about effective leadership styles, team management techniques, and how to inspire and guide organizations through change and challenges.",
      relatedArticles: 15,
      icon: "👥",
    },
    {
      name: "Entrepreneurship",
      summary:
        "Gain insights into starting and scaling businesses, from ideation and funding to growth strategies and overcoming common startup challenges.",
      relatedArticles: 20,
      icon: "🚀",
    },
    {
      name: "Finance",
      summary:
        "Understand financial management principles, investment strategies, and economic trends that impact business decisions and performance.",
      relatedArticles: 14,
      icon: "💰",
    },
    {
      name: "Sustainability",
      summary:
        "Explore eco-friendly business practices, ESG frameworks, and how companies are balancing profit with environmental and social responsibility.",
      relatedArticles: 16,
      icon: "🌱",
    },
    {
      name: "Innovation",
      summary:
        "Discover methodologies for fostering innovation, design thinking, and creating a culture that encourages creative problem-solving and continuous improvement.",
      relatedArticles: 22,
      icon: "💡",
    },
  ]

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc)
    setShowImageModal(true)
    document.body.style.overflow = "hidden"
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    document.body.style.overflow = "auto"
  }

  const openTopicModal = (topic) => {
    setSelectedTopic(topic)
    setShowTopicModal(true)
    document.body.style.overflow = "hidden"
  }

  const closeTopicModal = () => {
    setShowTopicModal(false)
    document.body.style.overflow = "auto"
  }

  const closeBlogModal = () => {
    setShowBlogModal(false)
    setSelectedBlog(null)
    document.body.style.overflow = "auto"
  }

  // Animation on scroll functionality
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
            setAnimatedElements((prev) => [...prev, entry.target])
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Close modals with escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showImageModal) closeImageModal()
        if (showTopicModal) closeTopicModal()
        if (showBlogModal) closeBlogModal()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [showImageModal, showTopicModal, showBlogModal])

  return (
    <div className="blog-container">
      {/* NavBar would be here */}
       <NavBar /> 

      {/* Header Section */}
      <div className="blog-header animate-on-scroll fade-in">
        <div className="header-image-container">
          <img
            src={headerImage || "/placeholder.svg"}
            alt="Blog Header"
            className="header-image"
            onClick={() => openImageModal(headerImage)}
          />
          <div className="image-overlay"></div>
        </div>
        <div className="header-content">
          <h1 className="header-title">BLOG</h1>
          <p className="header-breadcrumb">Home / Blog</p>
        </div>
      </div>

      {/* Blog Grid Section */}
      <Row className="blog-grid-section">
        {/* Blog Posts Column */}
        <Col xs={12} md={8} className="blog-posts-col">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`blog-post animate-on-scroll slide-up-${index % 2 === 0 ? "right" : "left"}`}
              onClick={() => {
                setSelectedBlog(post)
                setShowBlogModal(true)
                document.body.style.overflow = "hidden"
              }}
            >
              <div className="blog-image-container">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="blog-image"
                  onClick={() => openImageModal(post.image)}
                />
                <div className="image-overlay"></div>
              </div>
              <div className="blog-date">
                <p>{post.date}</p>
              </div>
              <div className="blog-content">
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-description">{post.description}</p>
              </div>
              <div className="blog-more">
                <button className="more-details-btn">
                  <span>More details</span>
                  <span className="more-icon">↗</span>
                </button>
              </div>
            </div>
          ))}
        </Col>

        {/* Topics Column */}
        <Col xs={12} md={4} className="topics-col">
          <div className="topics-container animate-on-scroll fade-in-up">
            <h3 className="topics-title">Topics</h3>
            <div className="topics-list">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="topic-item animate-on-scroll fade-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => openTopicModal(topic)}
                >
                  <div className="topic-indicator">{topic.icon}</div>
                  <span className="topic-name">{topic.name}</span>
                  <div className="topic-info">
                    <span className="topic-count">{topic.relatedArticles}</span>
                    <span className="topic-icon">›</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="newsletter-container animate-on-scroll fade-in-up">
              <h3 className="newsletter-title">Subscribe to Our Newsletter</h3>
              <p className="newsletter-description">Stay updated with our latest articles, news, and insights.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" className="newsletter-input" required />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>

      {/* Footer would be here */}
       <Footer /> 

      {/* Image Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeImageModal}>
              ×
            </button>
            <div className="modal-content">
              <img src={modalImage || "/placeholder.svg"} alt="Blog" className="modal-image" />
            </div>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {showTopicModal && selectedTopic && (
        <div className="modal-overlay topic-modal-overlay" onClick={closeTopicModal}>
          <div className="modal-container topic-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeTopicModal}>
              ×
            </button>
            <div className="modal-content topic-modal-content">
              <div className="topic-modal-header">
                <div className="topic-modal-icon">{selectedTopic.icon}</div>
                <h2 className="topic-modal-title">{selectedTopic.name}</h2>
              </div>
              <div className="topic-modal-summary">
                <p>{selectedTopic.summary}</p>
              </div>
              <div className="topic-modal-stats">
                <div className="topic-stat">
                  <span className="stat-number">{selectedTopic.relatedArticles}</span>
                  <span className="stat-label">Related Articles</span>
                </div>
                <div className="topic-stat">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
              <div className="topic-modal-actions">
                <button className="topic-action-btn primary">
                  Browse Articles
                  <span className="action-icon">→</span>
                </button>
                <button className="topic-action-btn secondary">Subscribe to Topic</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Modal */}
      {showBlogModal && selectedBlog && (
        <div className="modal-overlay blog-modal-overlay" onClick={closeBlogModal}>
          <div className="modal-container blog-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeBlogModal}>
              ×
            </button>
            <div className="modal-content blog-modal-content">
              <div className="blog-modal-image-container">
                <img
                  src={selectedBlog.image || "/placeholder.svg"}
                  alt={selectedBlog.title}
                  className="blog-modal-image"
                />
              </div>
              <div className="blog-modal-info">
                <span className="blog-modal-date highlight-text">{selectedBlog.date}</span>
                <h2 className="blog-modal-title">{selectedBlog.title}</h2>
                <div className="blog-modal-divider"></div>
                <p className="blog-modal-description">{selectedBlog.description}</p>

                <div className="blog-modal-extended-content">
                  <h3 className="highlight-text">Key Takeaways</h3>
                  <ul className="blog-modal-list">
                    <li>
                      <span className="special-text">Innovation</span> is driving rapid change across industries
                    </li>
                    <li>
                      Companies must <span className="special-text">adapt quickly</span> to remain competitive
                    </li>
                    <li>
                      The <span className="special-text">future of work</span> is being redefined
                    </li>
                  </ul>

                  <h3 className="highlight-text">Expert Opinion</h3>
                  <blockquote className="blog-modal-quote">
                    "The most successful organizations will be those that embrace change and foster a culture of
                    continuous learning and adaptation."
                  </blockquote>

                  <div className="blog-modal-actions">
                    <button className="blog-modal-btn primary">
                      Read Full Article
                      <span className="action-icon">→</span>
                    </button>
                    <button className="blog-modal-btn secondary">Save for Later</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

