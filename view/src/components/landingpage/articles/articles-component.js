import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col,
         Accordion } from 'react-bootstrap';

import { useLocation,
useNavigate
} from 'react-router-dom';

import '../../../styles/landingpage/articles/articles.scss';

export default function Articles() {

   const location = useLocation();
    const navigate = useNavigate();

 return (
    <Col id="articles">
     <Col id="articles-headerindicationscontainer">
       <h3 className="articles-headerindicationscontainer-headerindication">Latest News & Blog</h3>
       <h1 className="articles-headerindicationscontainer-headerindication">Read Our Latest Articles</h1>
     </Col>
     <Col id="articles-articlescontainer">
      <Row id="articles-articlescontainer-rowcontainer">
         <Col xs={12}
              md={4}
              lg={4}
              className="articles-articlescontainer-rowcontainer-positioningcolcontainer">
           <Col className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer">
             <Col className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-displayimagecontainer">
              <img src="../images/landingpage/articles/people.jpg"
                   className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-displayimagecontainer-displayimage"/>
             </Col>
             <Col className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer">
               <Row className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer">
                 <Col xs={6}
                      md={6}
                      lg={6}
                      className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer">
                    <p className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer-topicheaderindication">Finance</p>
                 </Col>
                 <Col xs={6}
                      md={6}
                      lg={6}
                      className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-datecontainer">
                    <p className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer-headerindication">November 17 2024</p>
                 </Col>
               </Row>
               <Col className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-titlecontainer">
                 <h5 className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer-headerindication">Stay Ahead With Our Exper Analysis</h5>
               </Col>
               <Row className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-buttonscontainer">
                 <Col xs={6}
                      md={6}
                      lg={6}
                      className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer">
                    <p className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer-continuereadingheaderindication"
                       onClick={()=> {
                        navigate("./readmoreaboutarticles")
                       }}>Continue reading</p>
                 </Col>
                 <Col xs={6}
                      md={6}
                      lg={6}
                      className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-datecontainer">
                    <p className="articles-articlescontainer-rowcontainer-positioningcolcontainer-layoutcontainer-articledetailscontainer-topicanddatecontainer-topiccontainer-minutesreadheaderindication">6 mins read</p>
                 </Col>
               </Row>
             </Col>
           </Col>
         </Col>
      </Row>
     </Col>
    </Col>
 )
}