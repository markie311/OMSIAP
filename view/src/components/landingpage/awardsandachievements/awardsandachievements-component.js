import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import '../../../styles/landingpage/awardsandachievements/awardsandachievements.scss';

export default function AwardsAndAchievements() {
 return (
    <Col id="awardsandachievements">
      <Row id="awardsandachievements-headerindicationsandviewallawardsandachievementsbuttonrowcontainer">
         <Col xs={12}
              md={8}
              lg={8}
              id="awardsandachievements-headerindicationsandviewallawardsandachievementsbuttonrowcontainer-headerindicationscontainer">
          <h3 className="awardsandachievements-headerindicationsandviewallawardsandachievementsbuttonrowcontainer-headerindicationscontainer-headerindication">Self-Growth and Corporate Service's</h3>
          <h2 className="awardsandachievements-headerindicationsandviewallawardsandachievementsbuttonrowcontainer-headerindicationscontainer-headerindication">Company awards and achievements</h2>
         </Col>
         <Col xs={12}
              md={4}
              lg={4}
              id="awardsandachievements-headerindicationsandviewallawardsandachievementsbuttonrowcontainer-viewallawardsandachievementsbuttoncontainer">
            <button id="awardsandachievements-headerindicationsandviewallawardsandachievementsbuttonrowcontainer-viewallawardsandachievementsbuttoncontainer-viewallawardsandachievementsbutton">________</button>
         </Col>
      </Row>
      <Row id="awardsandachievements-awardsandachievementsrowcontainer">
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">01</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Our Prestigious Awards</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">02</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Milestone Moments</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">03</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Industry Recognitions</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">04</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Accolades & Distictions</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">05</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Top Achievements</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">06</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Celebrating Success</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">07</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Awards & Honors</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                       onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
        <Col xs={12}
             md={6}
             lg={6}
             className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer">
          <Col className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer">
           <Row className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer">
              <Col xs={1}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-countcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">08</h3>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-awardsandachievementscontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication">Award Winning Excellence</h3>
              </Col>
              <Col xs={3}
                   md={4}
                   lg={4}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-displayimagecontainer">
              </Col>
              <Col xs={2}
                   md={1}
                   lg={1}
                   className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-arrowcontainer">
                 <h3 className="awardsandachievements-awardsandachievementsrowcontainer-layoutcontainer-positioningcontainer-rowcontainer-headerindication"
                      onClick={()=> {
                        const _awardscontainer = document.querySelector("#awards");
                        _awardscontainer.style.display = "block";
                     }}>-></h3>
              </Col>
           </Row>
          </Col>
        </Col>
      </Row>
    </Col>
 )
}