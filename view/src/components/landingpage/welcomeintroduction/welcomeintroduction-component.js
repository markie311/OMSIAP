import '../../../styles/landingpage/welcomeintroduction/welcomeintroduction.scss';

import React, { useEffect, useRef } from 'react';

const WelcomeIntroduction = () => {
  const imageRefs = useRef([]);
  
  useEffect(() => {
    // Initialize animation on component mount
    const observers = imageRefs.current.map((img, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Add animation with staggered delay
              setTimeout(() => {
                entry.target.classList.add('animate');
              }, index * 150);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      
      if (img) observer.observe(img);
      return observer;
    });
    
    // Cleanup
    return () => {
      observers.forEach(observer => {
        observer.disconnect();
      });
    };
  }, []);

  // Reset refs array
  imageRefs.current = [];
  
  // Add to refs array
  const addToRefs = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  return (
    <section className="welcome-introduction">
      <div className="container">
        <div className="content-row">
          <div className="text-column">
            <div className="text-content">
              <h3 className="subheading">BUILDING YOUR PATH TO SUCCESS.</h3>
              <h1 className="main-heading">Expert Services for Personal Growth and Business Development</h1>
              <div className="description">
                <p>One Unified Approach: We listen carefully to your needs for shelter, education, and advancement. At OMSIAP, we evaluate individual potential and help chart your course to success.</p>
                <p>Unlock Your Potential</p>
                <p>With OMSIAP's expert services and MFATIP program, you can receive monthly financial allocations dedicated to your personal growth.</p>
                <p>Comprehensive Ecosystem</p>
                <p>Engage with OMSIAP's marketplace, infrastructure initiatives, and community projects to maximize your financial benefits.</p>
                <p>Our Specialized Services</p>
                <ul>
                  <li>Strategic marketing and pension planning</li>
                  <li>Data-driven analytics with precision metrics</li>
                  <li>Innovative design and content creation</li>
                  <li>Infrastructure development</li>
                </ul>
              </div>
            </div>
            <div className="shield-image">
              <img 
                src="../images/landingpage/welcomeintroduction/goldenshield.jpg" 
                alt="Gold Shield"
                ref={addToRefs}
              />
            </div>
          </div>
          
          <div className="image-grid-column">
            <div className="image-grid">
              <div className="grid-item animation-fade-in">
                <img 
                  src="../images/landingpage/welcomeintroduction/construction.jpg" 
                  alt="Construction"
                  ref={addToRefs}
                />
              </div>
              <div className="grid-item animation-scale-in">
                <img 
                  src="../images/landingpage/welcomeintroduction/boss.jpg" 
                  alt="Business Professional"
                  ref={addToRefs}
                />
              </div>
              <div className="grid-item animation-slide-in">
                <img 
                  src="../images/landingpage/welcomeintroduction/worker.jpg" 
                  alt="Worker"
                  ref={addToRefs}
                />
              </div>
              <div className="grid-item animation-rotate-in">
                <img 
                  src="../images/landingpage/welcomeintroduction/graph.jpg" 
                  alt="Business Graph"
                  ref={addToRefs}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeIntroduction;