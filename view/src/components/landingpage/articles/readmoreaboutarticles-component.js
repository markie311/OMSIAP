"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"

import "../../../styles/landingpage/articles/readmoreaboutarticles.scss"

import NavBar from "../../navbar/navbar/navbar-component.js"
import Footer from "../footer/footer-component.js"

import axiosCreatedInstance from "../../../components/lib/axiosutil.js"

export default function BlogPage(props) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState("")
  const [animatedElements, setAnimatedElements] = useState([])
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [userInteraction, setUserInteraction] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [newReply, setNewReply] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [interactionLoading, setInteractionLoading] = useState(null)

  const [currentTopicFilter, setCurrentTopicFilter] = useState("All")
  const [topicBrowseLoading, setTopicBrowseLoading] = useState(false)

  const [commentLoading, setCommentLoading] = useState(false)
  const [replyLoading, setReplyLoading] = useState(null)

  const [showTopicArticlesModal, setShowTopicArticlesModal] = useState(false)
  const [topicArticles, setTopicArticles] = useState([])
  const [topicArticlesLoading, setTopicArticlesLoading] = useState(false)

  const headerImage = "../images/landingpage/articles/blog.jpg"

  const getTopicCount = (topicName) => {
    if (!props.articles || !Array.isArray(props.articles)) return 0
    return props.articles.filter((article) => article.data?.toLowerCase() === topicName.toLowerCase()).length
  }

  const topics = [
    {
      name: "All",
      summary: "Browse all articles across different topics and categories.",
      relatedArticles: props.articles?.length || 0,
      icon: "📚",
      filterValue: "All",
    },
    {
      name: "Business Strategy",
      summary:
        "Explore frameworks and methodologies for developing effective business strategies that drive growth and competitive advantage in today's dynamic market environment.",
      relatedArticles: getTopicCount("Business"),
      icon: "📊",
      filterValue: "Business",
    },
    {
      name: "Technology Trends",
      summary:
        "Stay updated with the latest technological innovations and trends shaping industries, from AI and machine learning to blockchain and IoT applications.",
      relatedArticles: getTopicCount("Technology"),
      icon: "💻",
      filterValue: "Technology",
    },
    {
      name: "Digital Marketing",
      summary:
        "Discover cutting-edge digital marketing strategies, tools, and best practices to reach your target audience and maximize ROI across various online channels.",
      relatedArticles: getTopicCount("Marketing"),
      icon: "📱",
      filterValue: "Marketing",
    },
    {
      name: "Leadership",
      summary:
        "Learn about effective leadership styles, team management techniques, and how to inspire and guide organizations through change and challenges.",
      relatedArticles: getTopicCount("Leadership"),
      icon: "👥",
      filterValue: "Leadership",
    },
    {
      name: "Entrepreneurship",
      summary:
        "Gain insights into starting and scaling businesses, from ideation and funding to growth strategies and overcoming common startup challenges.",
      relatedArticles: getTopicCount("Entrepreneurship"),
      icon: "🚀",
      filterValue: "Entrepreneurship",
    },
    {
      name: "Finance",
      summary:
        "Understand financial management principles, investment strategies, and economic trends that impact business decisions and performance.",
      relatedArticles: getTopicCount("Finance"),
      icon: "💰",
      filterValue: "Finance",
    },
    {
      name: "Sustainability",
      summary:
        "Explore eco-friendly business practices, ESG frameworks, and how companies are balancing profit with environmental and social responsibility.",
      relatedArticles: getTopicCount("Sustainability"),
      icon: "🌱",
      filterValue: "Sustainability",
    },
    {
      name: "Innovation",
      summary:
        "Discover methodologies for fostering innovation, design thinking, and creating a culture that encourages creative problem-solving and continuous improvement.",
      relatedArticles: getTopicCount("Innovation"),
      icon: "💡",
      filterValue: "Innovation",
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
    setUserInteraction(null)
    setInteractionLoading(null)
    document.body.style.overflow = "auto"
  }

  const openTopicArticlesModal = () => {
    setShowTopicArticlesModal(true)
    document.body.style.overflow = "hidden"
  }

  const closeTopicArticlesModal = () => {
    setShowTopicArticlesModal(false)
    setTopicArticles([])
    document.body.style.overflow = "auto"
  }

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

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showImageModal) closeImageModal()
        if (showTopicModal) closeTopicModal()
        if (showBlogModal) closeBlogModal()
        if (showTopicArticlesModal) closeTopicArticlesModal()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [showImageModal, showTopicModal, showBlogModal, showTopicArticlesModal])

  const handleInteraction = async (type) => {
    if (props.user?.registrationstatusesandlogs?.deviceloginstatus !== "logged in") {
      alert("Please log in to interact with articles")
      return
    }

    if (!props.user.contact?.phonenumber || !props.user.name?.firstname) {
      alert("Please complete your profile to interact with articles")
      return
    }

    if (userInteraction === type) {
      setInteractionLoading(type)

      const requestData = {
        articleId: selectedBlog.id,
        interactionType: type,
        userData: {
          name: `${props.user.name.firstname} ${props.user.name.lastname || ""}`.trim(),
          phonenumber: props.user.contact.phonenumber,
          date: new Date().toISOString(),
        },
        action: "remove",
        currentInteraction: userInteraction,
      }

      try {
        const response = await axiosCreatedInstance.post("/content/article-interaction", requestData)
        const result = response.data

        if (result.success) {
          setSelectedBlog((prevBlog) => {
            const updatedBlog = { ...prevBlog }

            if (!updatedBlog.interactions) {
              updatedBlog.interactions = {
                like: [],
                unlike: [],
                exited: [],
                wow: [],
                sad: [],
              }
            }

            const userPhone = props.user.contact.phonenumber
            if (updatedBlog.interactions[type]) {
              updatedBlog.interactions[type] = updatedBlog.interactions[type].filter(
                (interaction) => interaction.phonenumber !== userPhone,
              )
            }

            return updatedBlog
          })

          setUserInteraction(null)
        } else {
          alert("Failed to remove interaction. Please try again.")
        }
      } catch (error) {
        console.error("Remove interaction error:", error.response?.data || error.message)
        alert("Network error. Please try again.")
      } finally {
        setInteractionLoading(null)
      }
      return
    }

    setInteractionLoading(type)

    const requestData = {
      articleId: selectedBlog.id,
      interactionType: type,
      userData: {
        name: `${props.user.name.firstname} ${props.user.name.lastname || ""}`.trim(),
        phonenumber: props.user.contact.phonenumber,
        date: new Date().toISOString(),
      },
      action: "add",
      currentInteraction: userInteraction,
    }

    try {
      const response = await axiosCreatedInstance.post("/content/article-interaction", requestData)
      const result = response.data

      if (result.success) {
        setSelectedBlog((prevBlog) => {
          const updatedBlog = { ...prevBlog }

          if (!updatedBlog.interactions) {
            updatedBlog.interactions = {
              like: [],
              unlike: [],
              exited: [],
              wow: [],
              sad: [],
            }
          }

          const userPhone = props.user.contact.phonenumber
          const interactionTypes = ["like", "unlike", "exited", "wow", "sad"]

          interactionTypes.forEach((interactionType) => {
            if (updatedBlog.interactions[interactionType]) {
              updatedBlog.interactions[interactionType] = updatedBlog.interactions[interactionType].filter(
                (interaction) => interaction.phonenumber !== userPhone,
              )
            }
          })

          if (!updatedBlog.interactions[type]) {
            updatedBlog.interactions[type] = []
          }
          updatedBlog.interactions[type].push(requestData.userData)

          return updatedBlog
        })

        setUserInteraction(type)
      } else {
        alert("Failed to update interaction. Please try again.")
      }
    } catch (error) {
      console.error("Add interaction error:", error.response?.data || error.message)
      alert("Network error. Please try again.")
    } finally {
      setInteractionLoading(null)
    }
  }

  const getInteractionCount = (type) => {
    if (!selectedBlog?.interactions?.[type]) {
      return 0
    }
    return selectedBlog.interactions[type].length
  }

  useEffect(() => {
    if (selectedBlog && props.user?.contact?.phonenumber) {
      const userPhone = props.user.contact.phonenumber
      const interactionTypes = ["like", "unlike", "exited", "wow", "sad"]

      let foundInteraction = null
      for (const type of interactionTypes) {
        if (selectedBlog.interactions?.[type]) {
          const hasInteraction = selectedBlog.interactions[type].some(
            (interaction) => interaction.phonenumber === userPhone,
          )
          if (hasInteraction) {
            foundInteraction = type
            break
          }
        }
      }

      setUserInteraction(foundInteraction)
      setIsLoading(false)
    } else {
      setUserInteraction(null)
      setIsLoading(false)
    }
  }, [selectedBlog, props.user])

  useEffect(() => {
    if (showBlogModal && selectedBlog) {
      setIsLoading(false)
    } else if (showBlogModal) {
      setIsLoading(true)
    }
  }, [showBlogModal, selectedBlog])

  const handleAddComment = async () => {
    if (props.user?.registrationstatusesandlogs?.deviceloginstatus !== "logged in") {
      alert("Please log in to comment on articles")
      return
    }

    if (!props.user.contact?.phonenumber || !props.user.name?.firstname) {
      alert("Please complete your profile to comment on articles")
      return
    }

    if (!newComment.trim()) {
      alert("Please enter a comment")
      return
    }

    setCommentLoading(true)

    const commentData = {
      articleId: selectedBlog.id,
      comment: newComment.trim(),
      userData: {
        name: `${props.user.name.firstname} ${props.user.name.lastname || ""}`.trim(),
        phonenumber: props.user.contact.phonenumber,
        date: new Date().toISOString(),
      },
    }

    try {
      const response = await axiosCreatedInstance.post("/content/comment", commentData)
      const result = response.data

      if (result.success) {
        setSelectedBlog((prevBlog) => {
          const updatedBlog = { ...prevBlog }

          if (!updatedBlog.comments) {
            updatedBlog.comments = []
          }

          updatedBlog.comments.push(result.comment)

          return updatedBlog
        })

        setNewComment("")
      } else {
        alert("Failed to add comment. Please try again.")
      }
    } catch (error) {
      console.error("Add comment error:", error.response?.data || error.message)
      alert("Network error. Please try again.")
    } finally {
      setCommentLoading(false)
    }
  }

  const handleAddReply = async (commentIndex) => {
    if (props.user?.registrationstatusesandlogs?.deviceloginstatus !== "logged in") {
      alert("Please log in to reply to comments")
      return
    }

    if (!props.user.contact?.phonenumber || !props.user.name?.firstname) {
      alert("Please complete your profile to reply to comments")
      return
    }

    if (!newReply.trim()) {
      alert("Please enter a reply")
      return
    }

    setReplyLoading(commentIndex)

    const replyData = {
      articleId: selectedBlog.id,
      commentIndex: commentIndex,
      reply: newReply.trim(),
      userData: {
        name: `${props.user.name.firstname} ${props.user.name.lastname || ""}`.trim(),
        phonenumber: props.user.contact.phonenumber,
        date: new Date().toISOString(),
      },
    }

    try {
      const response = await axiosCreatedInstance.post("/content/reply", replyData)
      const result = response.data

      if (result.success) {
        setSelectedBlog((prevBlog) => {
          const updatedBlog = { ...prevBlog }

          if (updatedBlog.comments && updatedBlog.comments[commentIndex]) {
            if (!updatedBlog.comments[commentIndex].replies) {
              updatedBlog.comments[commentIndex].replies = []
            }

            updatedBlog.comments[commentIndex].replies.push(result.reply)
          }

          return updatedBlog
        })

        setNewReply("")
        setReplyingTo(null)
      } else {
        alert("Failed to add reply. Please try again.")
      }
    } catch (error) {
      console.error("Add reply error:", error.response?.data || error.message)
      alert("Network error. Please try again.")
    } finally {
      setReplyLoading(null)
    }
  }

  const handleCommentInteraction = async (commentIndex, interactionType) => {
    if (props.user?.registrationstatusesandlogs?.deviceloginstatus !== "logged in") {
      alert("Please log in to interact with comments")
      return
    }

    if (!props.user.contact?.phonenumber || !props.user.name?.firstname) {
      alert("Please complete your profile to interact with comments")
      return
    }

    const comment = selectedBlog.comments[commentIndex]
    const userPhone = props.user.contact.phonenumber

    let currentInteraction = null
    const interactionTypes = ["like", "unlike", "exited", "wow", "sad"]

    for (const type of interactionTypes) {
      if (comment.interactions?.[type]) {
        const hasInteraction = comment.interactions[type].some((interaction) => interaction.phonenumber === userPhone)
        if (hasInteraction) {
          currentInteraction = type
          break
        }
      }
    }

    const requestData = {
      articleId: selectedBlog.id,
      commentIndex: commentIndex,
      interactionType: interactionType,
      userData: {
        name: `${props.user.name.firstname} ${props.user.name.lastname || ""}`.trim(),
        phonenumber: props.user.contact.phonenumber,
        date: new Date().toISOString(),
      },
      currentInteraction: currentInteraction,
    }

    try {
      const response = await axiosCreatedInstance.post("/content/comment-interaction", requestData)
      const result = response.data

      if (result.success) {
        setSelectedBlog((prevBlog) => {
          const updatedBlog = { ...prevBlog }
          const comment = updatedBlog.comments[commentIndex]

          if (!comment.interactions) {
            comment.interactions = {
              like: [],
              unlike: [],
              exited: [],
              wow: [],
              sad: [],
            }
          }

          interactionTypes.forEach((type) => {
            if (comment.interactions[type]) {
              comment.interactions[type] = comment.interactions[type].filter(
                (interaction) => interaction.phonenumber !== userPhone,
              )
            }
          })

          if (interactionType !== currentInteraction) {
            if (!comment.interactions[interactionType]) {
              comment.interactions[interactionType] = []
            }
            comment.interactions[interactionType].push(requestData.userData)
          }

          return updatedBlog
        })
      } else {
        alert("Failed to update interaction. Please try again.")
      }
    } catch (error) {
      console.error("Comment interaction error:", error.response?.data || error.message)
      alert("Network error. Please try again.")
    }
  }

  const handleBrowseArticles = async (topic) => {
    if (!props.articlescb) {
      console.error("articlescb function not provided in props")
      return
    }

    setTopicBrowseLoading(true)

    try {
      closeTopicModal()

      setTimeout(async () => {
        setCurrentTopicFilter(topic.name)

        if (topic.filterValue === "All") {
          await props.articlescb("All")
        } else {
          await props.articlescb(topic.filterValue)
        }

        const blogPosts = document.querySelectorAll(".blog-post")
        blogPosts.forEach((post, index) => {
          post.style.opacity = "0"
          post.style.transform = "translateY(30px)"

          setTimeout(() => {
            post.style.transition = "all 0.6s ease"
            post.style.opacity = "1"
            post.style.transform = "translateY(0)"
          }, index * 100)
        })

        setTopicBrowseLoading(false)
      }, 300)
    } catch (error) {
      console.error("Error browsing articles:", error)
      setTopicBrowseLoading(false)
    }
  }

  const handleViewTopicArticles = (topic) => {
    setTopicArticlesLoading(true)

    // Filter articles based on topic
    let filteredArticles = []
    if (topic.filterValue === "All") {
      filteredArticles = props.articles || []
    } else {
      filteredArticles =
        props.articles?.filter((article) => article.data?.toLowerCase() === topic.filterValue.toLowerCase()) || []
    }

    setTopicArticles(filteredArticles)
    setTopicArticlesLoading(false)

    // Close topic modal and open articles modal
    closeTopicModal()
    setTimeout(() => {
      openTopicArticlesModal()
    }, 300)
  }

  const handleOpenBlogFromTopicModal = (blog) => {
    closeTopicArticlesModal()

    // Small delay to allow smooth transition between modals
    setTimeout(() => {
      setSelectedBlog(blog)
      setShowBlogModal(true)
      document.body.style.overflow = "hidden"
    }, 300)
  }

  return (
    <div className="blog-container">
      <NavBar />

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

      <Row className="blog-grid-section">
        <Col xs={12} md={8} className="blog-posts-col">
          {props.articles?.map((post, index) => (
            <div
              key={post.id}
              className={`blog-post`}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    openImageModal(post.image)
                  }}
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

        {currentTopicFilter !== "All" && (
          <div className="current-topic-filter animate-on-scroll fade-in">
            <div className="filter-container">
              <span className="filter-text">Showing articles for: </span>
              <span className="filter-topic">{currentTopicFilter}</span>
              <button
                className="clear-filter-btn"
                onClick={() => handleBrowseArticles({ name: "All", filterValue: "All" })}
                title="Show all articles"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </Row>

      <Footer />

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

                {selectedBlog.images && selectedBlog.images.length > 0 && (
                  <div className="blog-modal-gallery">
                    <h3 className="highlight-text">Gallery</h3>
                    <div className="gallery-grid">
                      {selectedBlog.images.map((image, index) => (
                        <div
                          key={index}
                          className="gallery-item"
                          onClick={(e) => {
                            e.stopPropagation()
                            openImageModal(image)
                          }}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Gallery ${index + 1}`}
                            className="gallery-image"
                          />
                          <div className="gallery-overlay">
                            <span className="gallery-zoom-icon">🔍</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="blog-modal-extended-content">
                  <h3 className="highlight-text">Key Takeaways</h3>
                  <ul className="blog-modal-list">
                    {selectedBlog.keytakeaways?.map((takeaway, index) => (
                      <li key={index}>
                        <span className="special-text">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                  <h3 className="highlight-text">Expert Opinion</h3>
                  <blockquote className="blog-modal-quote">{selectedBlog.expertopinion}</blockquote>

                  <div className="blog-interactions-section">
                    <div className="interactions-header">
                      <h3 className="highlight-text">How do you feel about this article?</h3>
                    </div>

                    <div className="interaction-buttons">
                      {isLoading ? (
                        <div className="loading-interactions">Loading interactions...</div>
                      ) : (
                        <>
                          {[
                            { type: "like", icon: "👍", label: "Like" },
                            { type: "wow", icon: "😮", label: "Wow" },
                            { type: "exited", icon: "🎉", label: "Excited" },
                            { type: "sad", icon: "😢", label: "Sad" },
                            { type: "unlike", icon: "👎", label: "Unlike" },
                          ].map(({ type, icon, label }) => {
                            const isActive = userInteraction === type
                            const isLoading = interactionLoading === type
                            const isDisabled = interactionLoading !== null

                            return (
                              <button
                                key={type}
                                className={`interaction-btn ${isActive ? "active" : ""} ${isLoading ? "loading" : ""}`}
                                onClick={() => handleInteraction(type)}
                                disabled={isDisabled}
                                title={`${label} this article`}
                                aria-pressed={isActive}
                              >
                                <span className="interaction-icon">{isLoading ? "⏳" : icon}</span>
                                <span className="interaction-label">{label}</span>
                                <span className="interaction-count">{getInteractionCount(type)}</span>
                              </button>
                            )
                          })}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="comments-section">
                    <div className="comments-header">
                      <h3 className="highlight-text">Comments ({selectedBlog?.comments?.length || 0})</h3>
                      <button className="toggle-comments-btn" onClick={() => setShowComments(!showComments)}>
                        {showComments ? "Hide Comments" : "Show Comments"}
                      </button>
                    </div>

                    {showComments && (
                      <div className="comments-container">
                        <div className="add-comment-form">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts about this article..."
                            className="comment-textarea"
                            rows="3"
                            disabled={commentLoading}
                          />
                          <button
                            className={`submit-comment-btn ${commentLoading ? "loading" : ""}`}
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || commentLoading}
                          >
                            {commentLoading ? "Posting..." : "Post Comment"}
                          </button>
                        </div>

                        <div className="comments-list">
                          {selectedBlog?.comments?.map((comment, commentIndex) => (
                            <div key={commentIndex} className="comment-item">
                              <div className="comment-content">
                                <div className="comment-author">
                                  <div className="author-avatar">
                                    <span>{comment.author?.name?.charAt(0) || "A"}</span>
                                  </div>
                                  <div className="author-info">
                                    <span className="author-name">{comment.author?.name || "Anonymous"}</span>
                                    <span className="comment-date">{comment.date || "Just now"}</span>
                                  </div>
                                </div>
                                <p className="comment-text">{comment.comment || "No comment text"}</p>

                                <div className="comment-interactions">
                                  {[
                                    { type: "like", icon: "👍", label: "Like" },
                                    { type: "unlike", icon: "👎", label: "Unlike" },
                                    { type: "wow", icon: "😮", label: "Wow" },
                                    { type: "exited", icon: "🎉", label: "Excited" },
                                    { type: "sad", icon: "😢", label: "Sad" },
                                  ].map(({ type, icon, label }) => {
                                    const count = comment.interactions?.[type]?.length || 0
                                    const userPhone = props.user?.contact?.phonenumber
                                    const isActive =
                                      userPhone &&
                                      comment.interactions?.[type]?.some(
                                        (interaction) => interaction.phonenumber === userPhone,
                                      )

                                    return (
                                      <button
                                        key={type}
                                        className={`comment-interaction-btn ${isActive ? "active" : ""}`}
                                        onClick={() =>
                                          handleCommentInteraction && handleCommentInteraction(commentIndex, type)
                                        }
                                        title={`${label} this comment`}
                                      >
                                        <span>{icon}</span>
                                        <span>{count}</span>
                                      </button>
                                    )
                                  })}
                                  <button
                                    className="reply-btn"
                                    onClick={() => setReplyingTo(replyingTo === commentIndex ? null : commentIndex)}
                                  >
                                    Reply ({comment.replies?.length || 0})
                                  </button>
                                </div>

                                {replyingTo === commentIndex && (
                                  <div className="reply-form">
                                    <textarea
                                      value={newReply}
                                      onChange={(e) => setNewReply(e.target.value)}
                                      placeholder="Write a reply..."
                                      className="reply-textarea"
                                      rows="2"
                                      disabled={replyLoading === commentIndex}
                                    />
                                    <div className="reply-actions">
                                      <button
                                        className={`submit-reply-btn ${replyLoading === commentIndex ? "loading" : ""}`}
                                        onClick={() => handleAddReply(commentIndex)}
                                        disabled={!newReply.trim() || replyLoading === commentIndex}
                                      >
                                        {replyLoading === commentIndex ? "Posting..." : "Post Reply"}
                                      </button>
                                      <button
                                        className="cancel-reply-btn"
                                        onClick={() => {
                                          setReplyingTo(null)
                                          setNewReply("")
                                        }}
                                        disabled={replyLoading === commentIndex}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="replies-container">
                                    {comment.replies.map((reply, replyIndex) => (
                                      <div key={replyIndex} className="reply-item">
                                        <div className="reply-author">
                                          <div
                                            className="author-avatar"
                                            style={{
                                              backgroundColor: "green",
                                              borderRadius: "50%",
                                              padding: "5px 10px",
                                              color: "white",
                                            }}
                                          >
                                            <span style={{ color: "white" }}>{reply?.name?.charAt(0) || "A"}</span>
                                          </div>
                                          &nbsp;
                                          <div className="author-info">
                                            <span className="author-name">{reply.name}</span>&nbsp;
                                            <span className="reply-date">{reply.date}</span>
                                          </div>
                                        </div>
                                        <p className="reply-text">{reply.reply}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}

                          {(!selectedBlog?.comments || selectedBlog.comments.length === 0) && (
                            <div className="no-comments">
                              <p>No comments yet. Be the first to share your thoughts!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

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
                <button
                  className={`topic-action-btn primary ${topicBrowseLoading ? "loading" : ""}`}
                  onClick={() => handleViewTopicArticles(selectedTopic)}
                  disabled={topicBrowseLoading}
                >
                  {topicBrowseLoading ? "Loading..." : "View All Articles"}
                  {!topicBrowseLoading && <span className="action-icon">→</span>}
                </button>
                <button className="topic-action-btn secondary">Subscribe to Topic</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTopicArticlesModal && (
        <div className="modal-overlay topic-articles-modal-overlay" onClick={closeTopicArticlesModal}>
          <div className="modal-container topic-articles-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeTopicArticlesModal}>
              ×
            </button>
            <div
              className="modal-content topic-articles-modal-content"
              style={{
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
              }}
            >
              <div
                className="topic-articles-header"
                style={{
                  flexShrink: 0,
                  marginBottom: "2rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "2px solid #e5e7eb",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "2rem",
                  borderRadius: "0.75rem 0.75rem 0 0",
                  marginTop: "-1rem",
                  marginLeft: "-1rem",
                  marginRight: "-1rem",
                }}
              >
                <h2
                  className="topic-articles-title"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#ffffff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {selectedTopic?.name} Articles
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <p
                    className="topic-articles-subtitle"
                    style={{
                      fontSize: "1rem",
                      color: "#f3f4f6",
                      margin: 0,
                    }}
                  >
                    Explore all articles related to {selectedTopic?.name}
                  </p>
                  <span
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#ffffff",
                      padding: "0.375rem 0.875rem",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {topicArticles.length} {topicArticles.length === 1 ? "Article" : "Articles"}
                  </span>
                </div>
              </div>

              {topicArticlesLoading ? (
                <div
                  className="topic-articles-loading"
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      width: "3rem",
                      height: "3rem",
                      border: "4px solid #e5e7eb",
                      borderTopColor: "#667eea",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <p style={{ marginTop: "1rem", fontSize: "1.125rem", fontWeight: "500" }}>Loading articles...</p>
                </div>
              ) : topicArticles.length === 0 ? (
                <div
                  className="topic-articles-empty"
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "#6b7280",
                    backgroundColor: "#f9fafb",
                    borderRadius: "0.75rem",
                    margin: "1rem",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                  <p style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151" }}>
                    No articles found for this topic.
                  </p>
                  <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Check back later for new content!</p>
                </div>
              ) : (
                <div
                  className="topic-articles-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.75rem",
                    padding: "1rem",
                  }}
                >
                  {topicArticles.map((article) => (
                    <div
                      key={article.id}
                      className="topic-article-card"
                      onClick={() => handleOpenBlogFromTopicModal(article)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "0.875rem",
                        overflow: "hidden",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        border: "1px solid #e5e7eb",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)"
                        e.currentTarget.style.boxShadow =
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        e.currentTarget.style.borderColor = "#667eea"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        e.currentTarget.style.borderColor = "#e5e7eb"
                      }}
                    >
                      <div
                        className="topic-article-image-container"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "220px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="topic-article-image"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            openImageModal(article.image)
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                          }}
                        />
                        <div
                          className="image-overlay"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))",
                          }}
                        ></div>
                        <div
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            padding: "0.375rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color: "#667eea",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {article.data || "Article"}
                        </div>
                      </div>
                      <div
                        className="topic-article-content"
                        style={{
                          padding: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          className="topic-article-date"
                          style={{
                            fontSize: "0.8125rem",
                            color: "#9ca3af",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                          }}
                        >
                          <span style={{ fontSize: "1rem" }}>📅</span>
                          <p style={{ margin: 0 }}>{article.date}</p>
                        </div>
                        <h3
                          className="topic-article-title"
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: "700",
                            color: "#1f2937",
                            lineHeight: "1.4",
                            marginBottom: "0.5rem",
                            wordWrap: "break-word",
                            hyphens: "auto",
                          }}
                        >
                          {article.title}
                        </h3>
                        <p
                          className="topic-article-description"
                          style={{
                            fontSize: "0.9375rem",
                            color: "#6b7280",
                            lineHeight: "1.6",
                            flexGrow: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {article.description}
                        </p>
                        <div
                          className="topic-article-footer"
                          style={{
                            marginTop: "auto",
                            paddingTop: "1rem",
                            borderTop: "1px solid #f3f4f6",
                          }}
                        >
                          <button
                            className="topic-article-btn"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              color: "#667eea",
                              fontSize: "0.9375rem",
                              fontWeight: "600",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              border: "none",
                              cursor: "pointer",
                              padding: "0.5rem 0",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.gap = "0.75rem"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.gap = "0.5rem"
                            }}
                          >
                            <span>Read More</span>
                            <span
                              className="more-icon"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "1.5rem",
                                height: "1.5rem",
                                borderRadius: "50%",
                                backgroundColor: "#667eea",
                                color: "white",
                                fontSize: "0.875rem",
                                transition: "transform 0.2s ease",
                              }}
                            >
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


