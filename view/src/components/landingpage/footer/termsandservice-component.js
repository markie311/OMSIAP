import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom'

import { Col } from 'react-bootstrap';
import '../../../styles/landingpage/footer/termsandservice.scss';

export default function TermsAndService() {

  const navigate = useNavigate()

  const sectionRefs = useRef([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('tos-visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <Col id="termsandservice" className="tos-container">

      <div className="tos-background-effects">
        <div className="tos-gradient-orb tos-orb-1"></div>
        <div className="tos-gradient-orb tos-orb-2"></div>
        <div className="tos-gradient-orb tos-orb-3"></div>
      </div>

      <div id="termsandservice-backbuttoncontainer">
        <button id="termsandservice-backbuttoncontainer-backbutton"
                onClick={()=> {
                  navigate('/')                
                }}>&larr;</button>
      </div>

      <div className="tos-content-wrapper">
        <div className="tos-header" ref={addToRefs}>
          <div className="tos-title-container">
            <h1 className="tos-main-title">Terms and Service</h1>
            <div className="tos-title-underline"></div>
          </div>
          <p className="tos-subtitle">
            OMSIAP - Of Macky's Ink And Paper
          </p>
          <p className="tos-effective-date">Effective Date: October 25, 2025</p>
        </div>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">01</div>
          <h2 className="tos-section-title">Acceptance of Terms</h2>
          <p className="tos-text">
            By accessing and using OMSIAP's website and e-commerce platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Service. If you do not agree with any part of these terms, please discontinue use of our services immediately.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">02</div>
          <h2 className="tos-section-title">Services Provided</h2>
          <p className="tos-text">
            OMSIAP operates as a business website with integrated e-commerce capabilities. Our platform facilitates:
          </p>
          <ul className="tos-list">
            <li className="tos-list-item">Product browsing and purchasing</li>
            <li className="tos-list-item">Secure transaction processing</li>
            <li className="tos-list-item">Promotional giveaways and campaigns</li>
            <li className="tos-list-item">Market analytics and data insights</li>
          </ul>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">03</div>
          <h2 className="tos-section-title">User Accounts</h2>
          <p className="tos-text">
            To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and all activities conducted under your account. You must notify us immediately of any unauthorized use or security breach.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">04</div>
          <h2 className="tos-section-title">E-Commerce Transactions</h2>
          <p className="tos-text">
            All purchases made through OMSIAP are subject to product availability and acceptance of your order. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.
          </p>
          <div className="tos-highlight-box">
            <h3 className="tos-highlight-title">Payment Terms</h3>
            <p className="tos-text">
              Payment must be received in full before products are shipped. We accept various payment methods as displayed during checkout. All prices are listed in the applicable currency and are subject to change without notice.
            </p>
          </div>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">05</div>
          <h2 className="tos-section-title">Giveaways and Promotions</h2>
          <p className="tos-text">
            Participation in giveaways and promotional campaigns is subject to specific rules and eligibility requirements. Winners will be selected according to the stated criteria and notified through the contact information provided. OMSIAP reserves the right to modify or cancel promotions at any time.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">06</div>
          <h2 className="tos-section-title">Data Analytics and Privacy</h2>
          <p className="tos-text">
            We collect and analyze market data to improve our services and user experience. Your personal information is handled in accordance with our Privacy Policy. By using our platform, you consent to the collection and use of data as described in our Privacy Policy.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">07</div>
          <h2 className="tos-section-title">Intellectual Property</h2>
          <p className="tos-text">
            All content on OMSIAP, including text, graphics, logos, images, and software, is the property of Of Macky's Ink And Paper and is protected by intellectual property laws. Unauthorized use, reproduction, or distribution of any content is strictly prohibited.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">08</div>
          <h2 className="tos-section-title">User Conduct</h2>
          <p className="tos-text">You agree not to:</p>
          <ul className="tos-list">
            <li className="tos-list-item">Use the platform for any unlawful purpose</li>
            <li className="tos-list-item">Attempt to gain unauthorized access to our systems</li>
            <li className="tos-list-item">Interfere with the proper functioning of the platform</li>
            <li className="tos-list-item">Transmit any harmful code or malicious software</li>
            <li className="tos-list-item">Impersonate any person or entity</li>
          </ul>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">09</div>
          <h2 className="tos-section-title">Limitation of Liability</h2>
          <p className="tos-text">
            OMSIAP shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. Our total liability shall not exceed the amount paid by you for the specific service or product giving rise to the claim.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">10</div>
          <h2 className="tos-section-title">Modifications to Terms</h2>
          <p className="tos-text">
            OMSIAP reserves the right to modify these Terms and Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after any modifications constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">11</div>
          <h2 className="tos-section-title">Termination</h2>
          <p className="tos-text">
            We reserve the right to suspend or terminate your access to our services at any time, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
          </p>
        </section>

        <section className="tos-section" ref={addToRefs}>
          <div className="tos-section-number">12</div>
          <h2 className="tos-section-title">Contact Information</h2>
          <p className="tos-text">
            For questions or concerns regarding these Terms and Service, please contact us:
          </p>
          <div className="tos-contact-box">
            <p className="tos-contact-item">
              <strong>Email:</strong> ofmackysinkandpaper@gmail.com
            </p>
            <p className="tos-contact-item">
              <strong>Business Name:</strong> OMSIAP - Of Macky's Ink And Paper
            </p>
          </div>
        </section>

        <div className="tos-footer" ref={addToRefs}>
          <div className="tos-footer-divider"></div>
          <p className="tos-footer-text">
            By continuing to use OMSIAP, you acknowledge your acceptance of these Terms and Service.
          </p>
          <p className="tos-footer-copyright">
            © 2025 OMSIAP - Of Macky's Ink And Paper. All rights reserved.
          </p>
        </div>
      </div>
    </Col>
  );
}