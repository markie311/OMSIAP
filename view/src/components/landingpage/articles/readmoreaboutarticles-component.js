import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import '../../../styles/landingpage/articles/readmoreaboutarticles.scss';

import NavBar from '../../navbar/navbar/navbar-component.js';
import Footer from '../footer/footer-component.js';

export default function ReadMoreAboutArticiles() {
 return (
  <Col id="readmoreaboutarticles">
    <Col id="readmoreaboutarticles-maingridviewcontainer">
      <NavBar />
      <Header />
      <Grid/ >
      <Footer />
    </Col>

  </Col>
 )
}

function Header() {
 return(
  <Col id="readmoreaboutarticles-headercontainer">
    <Col id="readmoreaboutarticles-headercontainer-backgroundimagecontainer">
      <img src="../images/landingpage/articles/laptopandcoffee.jpg"
           id="readmoreaboutarticles-headercontainer-backgroundimagecontainer-backgroundimage"/>
    </Col>
    <Col id="readmoreaboutarticles-headercontainer-headerindicationscontainer">
     <h1 className="readmoreaboutarticles-headercontainer-headerindicationscontainer-headerindication">BLOG</h1>
     <p className="readmoreaboutarticles-headercontainer-headerindicationscontainer-headerindication">Home/Blog</p>
    </Col>
  </Col>
 )
}

function Grid() {
 return (
  <Row id="readmoreaboutarticles-gridcontainer">
    <Col xs={12}
         md={8}
         lg={8}
         id="readmoreaboutarticles-gridcontainer-blogcontainer"> 
       <Col className="readmoreaboutarticles-gridcontainer-blogcontainer-blog">
         <Col className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-backgroundimagecontainer">
           ?<img src="../images/landingpage/articles/laptopandcoffee.jpg"
                 className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-backgroundimagecontainer-backgroundimage"/>
         </Col>
         <Col className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-datecontainer">
           <p className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-datecontainer-date">Jan 28, 2024</p>
         </Col>
         <Col className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-headerindicationscontainer">
            <h1 className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-headerindicationscontainer-headerindication">The Future of Business Technology: Trends to Watch</h1>
            <p className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-headerindicationscontainer-headerindication">As technology continues to evolve at a rapid pace, businesses must stay ahead of the curve to remain competitive. In this post, we explore the latest trends in business technology that are set to revolutionize industries and drive growth in the coming years.</p>
         </Col>
         <Col className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-moredetailscontainer">
           <p className="readmoreaboutarticles-gridcontainer-blogcontainer-blog-moredetailscontainer-moredetailsheaderindications">More details &#8593;</p>
         </Col>
       </Col>
    </Col>
    <Col xs={12}
         md={4}
         lg={4}
         id="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer">
      <Col id="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer">
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 <span className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication-spanheaderindication"> > </span></p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
        <p className="readmoreaboutarticles-gridcontainer-topicandnewslettercontainer-topicscontainer-topicsheaderindication">Topic 1 </p>
      </Col>
    </Col>
  </Row>
 )
}