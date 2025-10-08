"use client"

import '../../../styles/landingpage/articles/articles.scss';


import { useState } from "react"
import { Row, Col, Modal, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function Articles(props) {
  
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Sample articles data - in a real app, this would come from an API or props
  const articles = [
    {
      id: 1,
      image: "../images/landingpage/articles/omsiapwebsite.png",
      topic: "Business growth",
      date: "Wednesday",
      title: "OMSIAP's website platform launched",
      readTime: "6 mins read",
      content:
        "Detailed content about OMSIAP's website platform purpose and functionalitie's",
    }
  ]

  const openArticleModal = (article) => {
    setSelectedArticle(article)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <section className="articles-section">
      <div className="articles-header">
        <h3 className="articles-subtitle">Latest News & Blog</h3>
        <h1 className="articles-title">Read Our Latest Articles</h1>
      </div>

      <div className="articles-container">
        <Row className="articles-row">
          {props.articles.map((article) => (
            <Col xs={12} md={4} lg={4} key={article.id} className="article-col">
              <div className="article-card">
                <div className="article-image-container">
                  <img src={article.image || "/placeholder.svg"} alt={article.title} className="article-image" />
                </div>
                <div className="article-details">
                  <Row className="article-meta">
                    <Col xs={6} className="article-topic">
                      <p>{article.topic}</p>
                    </Col>
                    <Col xs={6} className="article-date">
                      <p>{article.date}</p>
                    </Col>
                  </Row>
                  <div className="article-title">
                    <h5>{article.title}</h5>
                  </div>
                  <div>
                    <h6 style={{color:"white"}}>{article.description}</h6>
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <Row className="article-actions">
                    <Col xs={6} className="article-read-more">
                      <button className="read-more-btn" onClick={() => openArticleModal(article)}>
                        Read topic header only and view image
                      </button>
                    </Col>
                    <Col xs={6} className="article-read-time">
                      <p>{article.readTime}</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div className="read-all-container">
          <button className="read-all-btn" onClick={() => navigate("./readmoreaboutarticles")}>
            Read All Articles
          </button>
        </div>
      </div>

      {/* Article Modal */}
      <Modal show={showModal} onHide={closeModal} centered dialogClassName="article-modal">
        {selectedArticle && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedArticle.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-article-meta">
                <span className="modal-article-topic">{selectedArticle.topic}</span>
                <span className="modal-article-date">{selectedArticle.date}</span>
                <span className="modal-article-read-time">{selectedArticle.readTime}</span>
              </div>
              <div className="modal-article-image">
                <img
                  src={selectedArticle.image || "/placeholder.svg"}
                  alt={selectedArticle.title}
                  className="img-fluid"
                />
              </div>
              <div className="modal-article-content">
                <p>{selectedArticle.content}</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" onClick={() => navigate("./readmoreaboutarticles")}>
                Read All Article's
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  )
}

