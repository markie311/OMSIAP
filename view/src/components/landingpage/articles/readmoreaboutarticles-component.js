"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import "../../../styles/landingpage/articles/readmoreaboutarticles.scss"

import NavBar from "../../navbar/navbar/navbar-component.js";
import Footer from "../footer/footer-component.js";

import axiosCreatedInstance from '../../../components/lib/axiosutil.js';

export default function BlogPage(props) {

  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState("")
  const [animatedElements, setAnimatedElements] = useState([])
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Add these state variables at the top with your other useState declarations
  const [userInteraction, setUserInteraction] = useState(null);
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [newReply, setNewReply] = useState('')

  const [isLoading, setIsLoading] = useState(true);

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


const handleInteraction = async (type) => {
  // Check if user is logged in
  if (props.user?.registrationstatusesandlogs?.deviceloginstatus !== "logged in") {
    alert('Please log in to interact with articles');
    return;
  }

  // Check if user has required data
  if (!props.user.contact?.phonenumber || !props.user.name?.firstname) {
    alert('Please complete your profile to interact with articles');
    return;
  }

  // Store previous state OUTSIDE try block so it's accessible in catch
  const previousInteraction = userInteraction;
  const newInteraction = type === userInteraction ? null : type;

  const requestData = {
    articleId: selectedBlog.id,
    interactionType: type,
    userData: {
      name: `${props.user.name.firstname} ${props.user.name.lastname || ''}`.trim(),
      phonenumber: props.user.contact.phonenumber,
      date: new Date().toISOString()
    },
    currentInteraction: userInteraction
  };

  try {
    // Update user interaction state
    setUserInteraction(newInteraction);
    
    // Update local counts
    updateLocalInteractionCounts(newInteraction, previousInteraction);
    
    const response = await axiosCreatedInstance.post('/content/interaction', requestData);
    const result = response.data;
    
    if (!result.success) {
      // Revert on failure
      setUserInteraction(previousInteraction);
      revertLocalInteractionCounts(newInteraction, previousInteraction);
      alert('Failed to update interaction. Please try again.');
    }
    
  } catch (error) {
    // Now these variables are accessible here
    setUserInteraction(previousInteraction);
    revertLocalInteractionCounts(newInteraction, previousInteraction);
    console.error('Full error details:', error.response?.data || error.message);
    alert('Network error. Please try again.');
  }
};

const updateLocalInteractionCounts = (newType, previousType) => {
  setSelectedBlog(prevBlog => {
    const updatedBlog = { ...prevBlog };
    
    // Initialize interactionCounts if it doesn't exist
    if (!updatedBlog.interactionCounts) {
      updatedBlog.interactionCounts = {
        likes: 0, unlikes: 0, exits: 0, wows: 0, sads: 0
      };
    }
    
    // Remove previous interaction count (if exists)
    if (previousType) {
      const prevMappedType = getInteractionMappedType(previousType);
      updatedBlog.interactionCounts[prevMappedType] = Math.max(0, 
        (updatedBlog.interactionCounts[prevMappedType] || 0) - 1
      );
    }
    
    // Add new interaction count (only if different from previous)
    if (newType && newType !== previousType) {
      const newMappedType = getInteractionMappedType(newType);
      updatedBlog.interactionCounts[newMappedType] = 
        (updatedBlog.interactionCounts[newMappedType] || 0) + 1;
    }
    
    return updatedBlog;
  });
};

// Helper function to revert local interaction counts
const revertLocalInteractionCounts = (newType, previousType) => {
  // Reverse the updateLocalInteractionCounts operation
  updateLocalInteractionCounts(previousType, newType);
};

// Helper function to get mapped interaction type
const getInteractionMappedType = (type) => {
  const typeMapping = {
    'like': 'likes',
    'wow': 'wows',
    'exited': 'exits',
    'sad': 'sads',
    'unlike': 'unlikes'
  };
  return typeMapping[type] || type;
};

// Add this useEffect to initialize user's current interaction when component mounts
useEffect(() => {
  if (props.articles?.interactions && 
      props.user?.registrationstatusesandlogs?.deviceloginstatus === "logged in" && 
      props.user.contact?.phonenumber) {
    
    const userPhone = props.user.contact.phonenumber;
    const interactionTypes = ['like', 'unlike', 'exited', 'wow', 'sad'];
    
    // Check which interaction type the user currently has
    for (const type of interactionTypes) {
      if (props.articles.interactions[type]) {
        const hasInteraction = props.articles.interactions[type].some(
          interaction => interaction.phonenumber === userPhone
        );
        if (hasInteraction) {
          setUserInteraction(type);
          break;
        }
      }
    }
  }
}, [props.articles, props.user]);


const getInteractionCount = (type) => {
  // Map the interaction types to match your data structure
  const typeMapping = {
    'like': 'likes',
    'wow': 'wows', 
    'exited': 'exits', // Note: your data has 'exits' not 'excited'
    'sad': 'sads',
    'unlike': 'unlikes'
  };
  
  const mappedType = typeMapping[type] || type;
  return selectedBlog?.interactionCounts?.[mappedType] || 0;
};

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here - update articles state
      setNewComment('')
    }
  }

  const handleAddReply = (commentIndex) => {
    if (newReply.trim()) {
      // Add reply logic here - update articles state
      setNewReply('')
      setReplyingTo(null)
    }
  }




 
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
          {props.articles.map((post, index) => (
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
                {selectedBlog.images && selectedBlog.images.length > 0 && (
                  <div className="blog-modal-gallery">
                    <h3 className="highlight-text">Gallery</h3>
                    <div className="gallery-grid">
                      {selectedBlog.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="gallery-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageModal(image);
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
                  <blockquote className="blog-modal-quote">
                    {selectedBlog.expertopinion}
                  </blockquote>

                   {/* Interactions Section */}
                  <div className="blog-interactions-section">
                    <div className="interactions-header">
                      <h3 className="highlight-text">How do you feel about this article?</h3>
                    </div>
                    
                    <div className="interaction-buttons">
                      {isLoading ? (
                        <div className="loading-interactions">Loading interactions...</div>
                      ) : (
                        <>
                          <button
                            className={`interaction-btn ${userInteraction === 'like' ? 'active' : ''}`}
                            onClick={() => handleInteraction('like')}
                            title="Like this article"
                          >
                            <span className="interaction-icon">👍</span>
                            <span className="interaction-label">Like</span>
                            <span className="interaction-count">{getInteractionCount('like')}</span>
                          </button>

                          <button
                            className={`interaction-btn ${userInteraction === 'wow' ? 'active' : ''}`}
                            onClick={() => handleInteraction('wow')}
                            title="This is amazing!"
                          >
                            <span className="interaction-icon">😮</span>
                            <span className="interaction-label">Wow</span>
                            <span className="interaction-count">{getInteractionCount('wow')}</span>
                          </button>

                          <button
                            className={`interaction-btn ${userInteraction === 'exited' ? 'active' : ''}`}
                            onClick={() => handleInteraction('exited')}
                            title="So excited!"
                          >
                            <span className="interaction-icon">🎉</span>
                            <span className="interaction-label">Excited</span>
                            <span className="interaction-count">{getInteractionCount('exited')}</span>
                          </button>

                          <button
                            className={`interaction-btn ${userInteraction === 'sad' ? 'active' : ''}`}
                            onClick={() => handleInteraction('sad')}
                            title="This makes me sad"
                          >
                            <span className="interaction-icon">😢</span>
                            <span className="interaction-label">Sad</span>
                            <span className="interaction-count">{getInteractionCount('sad')}</span>
                          </button>

                          <button
                            className={`interaction-btn ${userInteraction === 'unlike' ? 'active' : ''}`}
                            onClick={() => handleInteraction('unlike')}
                            title="I don't like this"
                          >
                            <span className="interaction-icon">👎</span>
                            <span className="interaction-label">Unlike</span>
                            <span className="interaction-count">{getInteractionCount('unlike')}</span>
                          </button>
                        </>
                      )}
                    </div>

                  </div>

                    {/* Comments Section */}
                  <div className="comments-section">
                    
                    <div className="comments-header">
                      <h3 className="highlight-text">Comments ({selectedBlog?.comments?.length || 0})</h3>
                      <button 
                        className="toggle-comments-btn"
                        onClick={() => setShowComments(!showComments)}
                      >
                        {showComments ? 'Hide Comments' : 'Show Comments'}
                      </button>
                    </div>
                    
                    {showComments && (
                      <div className="comments-container">
                        {/* Add Comment Form */}
                        <div className="add-comment-form">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts about this article..."
                            className="comment-textarea"
                            rows="3"
                          />
                          <button 
                            className="submit-comment-btn"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                          >
                            Post Comment
                          </button>
                        </div>
                        
                        {/* Comments List */}
                        <div className="comments-list">
                          {selectedBlog?.comments?.map((comment, commentIndex) => (
                            <div key={commentIndex} className="comment-item">
                              <div className="comment-content">
                                <div className="comment-author">
                                  <div className="author-avatar">
                                    <span>{comment.author?.name?.charAt(0) || 'A'}</span>
                                  </div>
                                  <div className="author-info">
                                    <span className="author-name">{comment.author?.name || 'Anonymous'}</span>
                                    <span className="comment-date">{comment.date || 'Just now'}</span>
                                  </div>
                                </div>
                                <p className="comment-text">{comment.comment || 'No comment text'}</p>
                                
                                {/* Comment Interactions */}
                                <div className="comment-interactions">
                                  <button className="comment-interaction-btn">
                                    <span>👍</span>
                                    <span>{comment.interactions?.like?.length || 0}</span>
                                  </button>
                                  <button className="comment-interaction-btn">
                                    <span>👎</span>
                                    <span>{comment.interactions?.unlike?.length || 0}</span>
                                  </button>
                                   <button className="comment-interaction-btn">
                                    <span>😮</span>
                                    <span>{comment.interactions?.wow?.length || 0}</span>
                                  </button>
                                   <button className="comment-interaction-btn">
                                    <span>🎉</span>
                                    <span>{comment.interactions?.excited?.length || 0}</span>
                                  </button>
                                   <button className="comment-interaction-btn">
                                    <span>😢</span>
                                    <span>{comment.interactions?.sad?.length || 0}</span>
                                  </button>
                                  <button 
                                    className="reply-btn"
                                    onClick={() => setReplyingTo(replyingTo === commentIndex ? null : commentIndex)}
                                  >
                                    Reply ({comment.replies?.length || 0})
                                  </button>
                                </div>
                                
                                {/* Reply Form */}
                                {replyingTo === commentIndex && (
                                  <div className="reply-form">
                                    <textarea
                                      value={newReply}
                                      onChange={(e) => setNewReply(e.target.value)}
                                      placeholder="Write a reply..."
                                      className="reply-textarea"
                                      rows="2"
                                    />
                                    <div className="reply-actions">
                                      <button 
                                        className="submit-reply-btn"
                                        onClick={() => handleAddReply(commentIndex)}
                                        disabled={!newReply.trim()}
                                      >
                                        Post Reply
                                      </button>
                                      <button 
                                        className="cancel-reply-btn"
                                        onClick={() => {
                                          setReplyingTo(null)
                                          setNewReply('')
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="replies-container">
                                    {comment.replies.map((reply, replyIndex) => (
                                      <div key={replyIndex} className="reply-item">
                                        <div className="reply-author">
                                          <div className="author-avatar" style={{backgroundColor: "green", borderRadius: "50%", padding: "5px 10px", color: "white"}}>
                                            <span style={{color: "white"}}>{reply?.name?.charAt(0) || 'A'}</span>
                                          </div>&nbsp;
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

    

    </div>
  )
}