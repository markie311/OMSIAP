import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown,
         Carousel,
         Accordion
       } from 'react-bootstrap';
    
import { useLocation,
         useNavigate
        } from 'react-router-dom';

import '../../styles/market/market.scss';

import Footer from '../landingpage/footer/footer-component.js';


export default function Market(props) {

  const [productdescriptionmodalproductdescriptionnavigationmodalview, productdescriptionmodalproductdescriptionnavigationmodalviewcb] = useState("Description");

 return (
  <Col id="market">
    <Col id='market-positioningcontainer'>  
      <MarketingPage />
    </Col>

    <QuickLookProductDescriptionModal />

    <ProductDescriptionModal productdescriptionmodalproductdescriptionnavigationmodalview={productdescriptionmodalproductdescriptionnavigationmodalview}
                             productdescriptionmodalproductdescriptionnavigationmodalviewcb={productdescriptionmodalproductdescriptionnavigationmodalviewcb}/>

  </Col>
 )
}

function NavBar(props) {
  
  const location = useLocation();
  const navigate = useNavigate();

 return (
  <Col id="market-navbar">
    {
      props.viewport === 'xs' ? 
      (
        <Row id="market-smallernavbar-rowcontainer">
          <Col xs={6}
               md={12}
               lg={12}
               className="market-smallernavbar-rowcontainer-colcontainer">
            <h1 className="market-smallernavbar-rowcontainer-colcontainer-headerindication">DEPOT</h1>
          </Col>
          <Col xs={6}
               md={12}
               lg={12}
               className="market-smallernavbar-rowcontainer-colcontainer">
            <Row id="market-smallernavbar-rowcontainer-colcontainer-rowcontainer">
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="market-smallernavbar-rowcontainer-colcontainer-rowcontainer-colcontainer">
                <p className="market-smallernavbar-rowcontainer-colcontainer-headerindication">MENU</p>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="market-smallernavbar-rowcontainer-colcontainer-rowcontainer-colcontainer">
                <div id="market-smallernavbar-rowcontainer-colcontainer-rowcontainer-colcontainer-hamburger">
                  <div className="market-smallernavbar-rowcontainer-colcontainer-rowcontainer-colcontainer-hamburger-hamburgerline">

                  </div>
                  <div className="market-smallernavbar-rowcontainer-colcontainer-rowcontainer-colcontainer-hamburger-hamburgerline">

                  </div>
                  <div className="market-smallernavbar-rowcontainer-colcontainer-rowcontainer-colcontainer-hamburger-hamburgerline">

                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      )
      :
      (
       <Row id="market-navbar-rowcontainer">
         <Col xs={12}
              md={1}
              lg={1}
              className="market-navbar-rowcontainer-colcontainer">
           <p className="market-navbar-rowcontainer-colcontainer-headerindication">HOME</p>
         </Col>
         <Col xs={12}
              md={1}
              lg={1}
              className="market-navbar-rowcontainer-colcontainer">
           <p className="market-navbar-rowcontainer-colcontainer-headerindication">SHOP</p>
         </Col>
         <Col xs={12}
              md={1}
              lg={1}
              className="market-navbar-rowcontainer-colcontainer">
           <p className="market-navbar-rowcontainer-colcontainer-headerindication">PAGES</p>
         </Col>
         <Col xs={12}
              md={1}
              lg={1}
              className="market-navbar-rowcontainer-colcontainer">
             <p className="market-navbar-rowcontainer-colcontainer-headerindication">ELEMENTS</p>
         </Col>
         <Col xs={12}
              md={6}
              lg={6}
              className="market-navbar-rowcontainer-colcontainer">
            <h1 className="market-navbar-rowcontainer-colcontainer-headerindication">DEPOT</h1>
         </Col>
         <Col xs={12}
              md={1}
              lg={1}
              className="market-navbar-rowcontainer-colcontainer">
            <p className="market-navbar-rowcontainer-colcontainer-headerindication"
               onClick={() => {
                navigate('/cart')
               }}>CART <span>($170)</span></p>
         </Col>
         <Col xs={12}
              md={1}
              lg={1}
              className="market-navbar-rowcontainer-colcontainer">
          <p className="market-navbar-rowcontainer-colcontainer-headerindication">LOGIN</p>
         </Col>
         <Col xs={12}
              md={12}
              lg={12}
              id="market-navbar-rowcontainer-navigationmenucontainer">
         </Col>
       </Row> 
      )
    }
  </Col>
 )
}

function MarketCarousel(props) {

 const [index, setIndex] = useState(0);

 const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
  };

 return (
    <Col id="carousel">
      <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img src="../images/hope/market.jpg"
              className="carousel-backgroundimage"/>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="../images/hope/market.jpg"
            className="carousel-backgroundimage"/>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item> 
          <img src="../images/hope/market.jpg"
              className="carousel-backgroundimage"/>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      </Carousel>
   </Col>
)
}

function ProductNavigation(props) {
 return (
   <Col id="productnavigation">
    {
      props.viewport === "xs" ? 
      (
        <Col id="productnavigation-smallerviewports">
        <Accordion defaultActiveKey="0">
         <Accordion.Item eventKey="0">
          <Accordion.Header>CATEGORIES</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
         </Accordion.Item>
         <Accordion.Item eventKey="1">
          <Accordion.Header>FILTER</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
         </Accordion.Item>
       </Accordion>
       </Col>
      )
      :
      (
        <Row id="productnavigation-rowcontainer">
        <Col xs={8}
             md={8}
             lg={8}
             className="productnavigation-colcontainer">
         <Row id="productnavigation-colcontainer-productcategoryrowcontainer">
         {
          ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'].map((data, dataindx)=> {
            return (
             <Col xs={12}
                  md={3}
                  lg={3}
                  className="productnavigation-colcontainer-productcategoryrowcontainer-colcontainer">
               <p className="productnavigation-colcontainer-productcategoryrowcontainer-colcontainer-productcategoryheaderindication">Sample text</p>
             </Col>
            )
          })
         }
         </Row>
        </Col>
        <Col xs={4}
             md={4}
             lg={4}
             className="productnavigation-colcontainer">
          <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filter</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </Col>
        </Row>
      )
    }
 </Col>
)
}

function ProductList() {
 return (
  <Col id="productlist">
    <Col id="productlist-loadingindicationcontainer">
     <p className="productlist-loadingindicationcontainer-loadingheaderindication">LOADING...</p>
    </Col>
    <Row id="productlist-productlistrowcontainer">
     <Col xs={12}
          md={3}
          lg={3}
          className="productlist-productlistrowcontainer-positioningcolcontainer">
       <Col className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer">
         <Col className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-productdetailscontainer"
               onClick={()=> {
                const _productdescriptionmodal = document.querySelector('#productdescriptionmodal');
                _productdescriptionmodal.style.display = "block";
               }}>
           <Col className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-productdetailscontainer-productdisplayimagecontainer">
             <img src="../images/market/products/watch.jpg"
                  className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-productdetailscontainer-productdisplayimagecontainer-productdisplayimage"/>
           </Col>
           <Col className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-productdetailscontainer-productdetailscontainer">
             <p className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-productdetailscontainer-productdetailscontainer-productdetailsheaderindication">NEON WATCH</p>
             <p className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-productdetailscontainer-productdetailscontainer-productdetailsheaderindication">$60</p>
           </Col>
         </Col>
         <Col className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-quicklookcontainer">
          <p className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-quicklookcontainer-headerindication"
             onClick={(evt)=> {
              const _productdescriptionmodal = document.querySelector("#quicklookproductdescriptionmodal");
              _productdescriptionmodal.style.display = "flex";
             }}>QUICK LOOK</p>
          <p className="productlist-productlistrowcontainer-positioningcolcontainer-layoutcontainer-quicklookcontainer-headerindication">ADD TO CART</p>
         </Col>
       </Col>
     </Col>
    </Row>
  </Col>
 )
}

function QuickLookProductDescriptionModal() {

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
       setIndex(selectedIndex);
   };

  return (
   <Col id="quicklookproductdescriptionmodal">
     <div id="quicklookproductdescriptionmodal-positioningcontainer">
      <Row id="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer">
        <Col xs={12}
             md={6}
             lg={6}
             className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer">
           <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
              <img src="../images/hope/market.jpg"
                    className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-productdisplayimage"/>
            </Carousel.Item>
            <Carousel.Item>
              <img src="../images/hope/market.jpg"
                  className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-productdisplayimage"/>
            </Carousel.Item>
            <Carousel.Item> 
                <img src="../images/hope/market.jpg"
                    className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-productdisplayimage"/>
            </Carousel.Item>
           </Carousel>
        </Col>
        <Col className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer">
          <div id="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-closebuttoncontainer">
            <p id="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-closebuttoncontainer-closebuttonheaderindication"
               onClick={()=> {
                const _productdescriptionmodal = document.querySelector("#quicklookproductdescriptionmodal");
                _productdescriptionmodal.style.display = "none";
               }}>x</p>
          </div>
          <p className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-headerindication">NEON WATCH</p>
          <p className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-headerindication">$160</p>
          <p className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-headerindication">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Vestibulum ultricies aliquam convallis.</p>

          
          <Row id="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-rowcontainer">
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-rowcontainer-colcontainer">
            </Col>
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="quicklookproductdescriptionmodal-positioningcontainer-rowcontainer-colcontainer-rowcontainer-colcontainer">
            </Col>
          </Row>
        </Col>
      </Row>
     </div>
   </Col>
  )
}

function ProductDescriptionModal(props) {
 return (
  <Col id="productdescriptionmodal">
    <Col id="productdescriptionmodal-mainviewcontainer">

     <Col id="productdescriptionmodal-navigationcontainer">
      <NavBar viewport={props.viewport}/>
     </Col>

     <Col id="productdescriptionmodal-scrollableviewcontainer">
      <Row id="productdescriptionmodal-productcategorylistcontainer">
        <Col xs={2}
            md={1}
            lg={1}
            className="productdescriptionmodal-productcategorylistcontainer-productcategoryheaderindicationcontainer">
          <p className="productdescriptionmodal-productcategorylistcontainer-productcategoryheaderindicationcontainer-backheaderindication"
             onClick={()=> {
               const _productdescriptionmodal = document.querySelector('#productdescriptionmodal');
               _productdescriptionmodal.style.display = "none";
             }}>Back</p>
        </Col>
        <Col xs={2}
            md={1}
            lg={1}
            className="productdescriptionmodal-productcategorylistcontainer-productcategoryheaderindicationcontainer">
          <p className="productdescriptionmodal-productcategorylistcontainer-productcategoryheaderindicationcontainer-productcategoryheaderindication">Home</p>
        </Col>
      </Row>
      <Row id="productdescriptionmodal-productdescriptionrowcontainer">
         <Col xs={2}
              md={2}
              lg={2}
              id="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer">
            <Row id="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-rowcontainer">
              <Col xs={12}
                   md={12}
                   lg={12}
                   className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-rowcontainer-colcontainer">
                 <img src="../images/market/products/watch.jpg"
                      className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-productselectionimage"/>
              </Col>
              <Col xs={12}
                   md={12}
                   lg={12}
                   className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-rowcontainer-colcontainer">
                 <img src="../images/market/products/watch.jpg"
                      className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-productselectionimage"/>
              </Col>
              <Col xs={12}
                   md={12}
                   lg={12}
                   className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-rowcontainer-colcontainer">
                <img src="../images/market/products/watch.jpg"
                     className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-productselectionimage"/>
              </Col>
              <Col xs={12}
                   md={12}
                   lg={12}
                   className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-rowcontainer-colcontainer">
                <img src="../images/market/products/watch.jpg"
                     className="productdescriptionmodal-productdescriptionrowcontainer-productimageselectioncontainer-productselectionimage"/>
              </Col>
            </Row>
         </Col>
         <Col xs={5}
              md={5}
              lg={5}
              id="productdescriptionmodal-productdescriptionrowcontainer-productimagedisplaycontainer">
            <img src="../images/market/products/watch.jpg"
                 id="productdescriptionmodal-productdescriptionrowcontainer-productimagedisplay"/>
         </Col>
         <Col xs={5}
              md={5}
              lg={5}
              id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer">
            <Col id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-headerindicationscontainer">
              <h1 className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-headerindicationscontainer-headerindication">NEON WATCH</h1>
              <h2 className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-headerindicationscontainer-headerindication">$160</h2>
            </Col>
            <Row id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-ratingscontainer">
              <Col xs={6}
                   md={6}
                   lg={6}
                   id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-ratingscontainer-ratingindicationcontainer">
                <p className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-ratingscontainer-headerindication">*****</p>
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-ratingscontainer-customerreviewheaderindicationcontainer">
                <p className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-ratingscontainer-headerindication">(CUSTOMER REVIEW)</p>
              </Col>
            </Row>
            <Col id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-productdescriptioncontainer">
              <p className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-productdescriptioncontainer-productdescriptionheaderindication">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Vestibulum ultricies aliquam convallis.</p>
            </Col>
            <Row id="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-addtocartrowcontainer">
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-addtocartrowcontainer-colcontainer">
              </Col>
              <Col xs={6}
                   md={6}
                   lg={6}
                   className="productdescriptionmodal-productdescriptionrowcontainer-productdescriptioncontainer-addtocartrowcontainer-colcontainer">
              </Col>
            </Row>
         </Col>
      </Row>
      <Col id="productdescriptionmodal-productdescriptionnavigationcontainer">
        <Row id="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer">
          <Col xs={3}
               md={2}
               lg={2}
               className="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer">
            <button className="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationbutton productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationdescriptionbutton"
                    onClick={(evt)=> {

                      const  _productnavigationbutton = evt.target;
                      const _allproductnavigationbutton = document.querySelectorAll('.productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationbutton');

                      for ( let indx = 0; indx < _allproductnavigationbutton.length; indx++ ) {
                        _allproductnavigationbutton[indx].style.backgroundColor = "white";
                        _allproductnavigationbutton[indx].style.color = "black";
                      }

                      _productnavigationbutton.style.backgroundColor = "black";
                      _productnavigationbutton.style.color = "white";

                      props.productdescriptionmodalproductdescriptionnavigationmodalviewcb((view)=> view = "Description" );

                    }}>DESCRIPTION</button>
          </Col>
          <Col xs={3}
               md={2}
               lg={2}
               className="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer">
            <button className="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationbutton"
                     onClick={(evt)=> {

                      const  _productnavigationbutton = evt.target;
                      const _allproductnavigationbutton = document.querySelectorAll('.productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationbutton');

                      for ( let indx = 0; indx < _allproductnavigationbutton.length; indx++ ) {
                        _allproductnavigationbutton[indx].style.backgroundColor = "white";
                        _allproductnavigationbutton[indx].style.color = "black";
                      }

                      _productnavigationbutton.style.backgroundColor = "black";
                      _productnavigationbutton.style.color = "white";

                      props.productdescriptionmodalproductdescriptionnavigationmodalviewcb((view)=> view = "Additional Information" );
                    }}>ADDIOTIONAL INFORMATION</button>
          </Col>
          <Col xs={3}
               md={2}
               lg={2}
               className="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer">
            <button className="productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationbutton"    
                    onClick={(evt)=> {

                      const  _productnavigationbutton = evt.target;
                      const _allproductnavigationbutton = document.querySelectorAll('.productdescriptionmodal-productdescriptionnavigationcontainer-productnavigationrowcontainer-colcontainer-productnavigationbutton');

                      for ( let indx = 0; indx < _allproductnavigationbutton.length; indx++ ) {
                        _allproductnavigationbutton[indx].style.backgroundColor = "white";
                        _allproductnavigationbutton[indx].style.color = "black";
                      }

                      _productnavigationbutton.style.backgroundColor = "black";
                      _productnavigationbutton.style.color = "white";

                      props.productdescriptionmodalproductdescriptionnavigationmodalviewcb((view)=> view = "Reviews" );
                    }}>REVIEWS (1)</button>
          </Col>
        </Row>
        <Col id="productdescriptionmodal-productdescriptionnavigationcontainer-viewcontainer">
          <ProductDescriptionModalProductDescriptionNavigationModalView  productdescriptionmodalproductdescriptionnavigationmodalview={props.productdescriptionmodalproductdescriptionnavigationmodalview}/>
        </Col>
      </Col>
     </Col>

    </Col> 
  </Col>
 )
}

function ProductDescriptionModalProductDescriptionNavigationModalView(props) {
 
  if ( props.productdescriptionmodalproductdescriptionnavigationmodalview === "Description" ) {
    return (
      <Col id="productdescriptionmodal-productdescriptionnavigationcontainer-descriptioncontainer">
        <h4 className="productdescriptionmodal-productdescriptionnavigationcontainer-descriptioncontainer-productdescriptionheaderindication">DESCRIPTION</h4>
        <p className="productdescriptionmodal-productdescriptionnavigationcontainer-descriptioncontainer-productdescriptionheaderindication">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Vestibulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames.</p>
      </Col>
    )
  }

  if ( props.productdescriptionmodalproductdescriptionnavigationmodalview === "Additional Information" ) {
    return (
     <Col id="productdescriptionmodal-productdescriptionnavigationcontainer-additionalinformationcontainer">
      <h4 className="productdescriptionmodal-productdescriptionnavigationcontainer-additionalinformationcontainer-addtionalinformationheaderindication">ADDTIONAL INFORMATION</h4>
      <p className="productdescriptionmodal-productdescriptionnavigationcontainer-additionalinformationcontainer-addtionalinformationheaderindication">Weight	2 kg</p>
      <p className="productdescriptionmodal-productdescriptionnavigationcontainer-additionalinformationcontainer-addtionalinformationheaderindication">Dimensions	10 × 10 × 15 cm</p>
      <p className="productdescriptionmodal-productdescriptionnavigationcontainer-additionalinformationcontainer-addtionalinformationheaderindication">Color Beige, Black</p>
      <p className="productdescriptionmodal-productdescriptionnavigationcontainer-additionalinformationcontainer-addtionalinformationheaderindication">Material Metal, Wood</p>
     </Col>
    )
  }

  if ( props.productdescriptionmodalproductdescriptionnavigationmodalview === "Reviews" ) {
    return (
     <Col id="productdescriptionmodal-productdescriptionnavigationcontainer-reviewscontainer">
       <Col id="productdescriptionmodal-productdescriptionnavigationcontainer-reviewscontainer-headerindicationcontainer">
       </Col>
       <Row id="productdescriptionmodal-productdescriptionnavigationcontainer-reviewscontainer-userdetailscontainer">
         <Col xs={2}
              md={2}
              lg={2}
              id="productdescriptionmodal-productdescriptionnavigationcontainer-reviewscontainer-userdetailscontainer-profilepicturecontainer">
         </Col>
         <Col xs={2}
              md={2}
              lg={2}
              id="productdescriptionmodal-productdescriptionnavigationcontainer-reviewscontainer-userdetailscontainer-userdetailscontainer">
         </Col>
       </Row>
       <Col id="productdescriptionmodal-productdescriptionnavigationcontainer-reviewscontainer-ratingscontainer">
       </Col>
     </Col>
    )
  }

}


function MarketingPage() {
// Sample data - replace with your actual data
const categories = [
{ id: 1, name: "Electronics", description: "Latest gadgets and electronic devices for your tech needs" },
{ id: 2, name: "Clothing", description: "Trendy and comfortable clothing for all seasons" },
{ id: 3, name: "Home & Kitchen", description: "Essential items to make your house a home" },
{ id: 4, name: "Beauty & Personal Care", description: "Premium products for your self-care routine" }
];

const products = [
{ 
id: 1, 
name: "Wireless Headphones", 
price: 89.99, 
category: 1, 
image: "../images/market/products/watch.jpg",
description: "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and professionals alike."
},
{ 
id: 2, 
name: "Smart Watch", 
price: 199.99, 
category: 1, 
image: "../images/market/products/watch.jpg",
description: "Track your fitness, receive notifications, and more with this sleek smartwatch. Water-resistant and long-lasting battery."
},
{ 
id: 3, 
name: "Cotton T-Shirt", 
price: 24.99, 
category: 2, 
image: "../images/market/products/watch.jpg",
description: "Soft, comfortable cotton t-shirt available in multiple colors. A wardrobe essential for any season."
},
{ 
id: 4, 
name: "Denim Jeans", 
price: 59.99, 
category: 2, 
image: "../images/market/products/watch.jpg",
description: "Classic denim jeans with a modern fit. Durable and stylish for everyday wear."
},
{ 
id: 5, 
name: "Coffee Maker", 
price: 79.99, 
category: 3, 
image: "../images/market/products/watch.jpg",
description: "Programmable coffee maker that brews up to 12 cups. Start your day right with the perfect cup of coffee."
},
{ 
id: 6, 
name: "Moisturizer", 
price: 34.99, 
category: 4, 
image: "../images/market/products/watch.jpg",
description: "Hydrating moisturizer for all skin types. Keeps your skin soft and supple throughout the day."
}
];

// State management
const [selectedCategory, setSelectedCategory] = useState(null);
const [cart, setCart] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

// Filter products by selected category
const filteredProducts = selectedCategory 
? products.filter(product => product.category === selectedCategory) 
: products;

// Add product to cart
const addToCart = (product) => {
const existingItem = cart.find(item => item.id === product.id);

if (existingItem) {
setCart(cart.map(item => 
item.id === product.id 
? { ...item, quantity: item.quantity + 1 } 
: item
));
} else {
setCart([...cart, { ...product, quantity: 1 }]);
}
};

// Remove from cart
const removeFromCart = (productId) => {
setCart(cart.filter(item => item.id !== productId));
};

// Calculate total items in cart
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

// Calculate total price
const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

return (
<div className="marketing-page">
{/* Header */}
<header className="header">
<div className="logo">
<h1>Your Brand</h1>
</div>
<nav className="nav">
<ul>
  <li><a href="#home">Home</a></li>
  <li><a href="#products">Products</a></li>
  <li><a href="#about">About</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>
</nav>
<div className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}>
<div className="cart-button">
  <span className="material-icons">shopping_cart</span>
  {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
</div>
</div>
</header>

{/* Hero Section */}
<section className="hero">
<div className="hero-content">
<h2>Quality Products for Every Need</h2>
<p>Discover our premium selection of products designed to enhance your lifestyle</p>
<button className="btn-primary">Shop Now</button>
</div>
</section>

{/* Categories Section */}
<section className="categories-section" id="categories">
<h2>Browse Categories</h2>
<div className="categories-container">
<div 
  className={`category-card ${selectedCategory === null ? 'active' : ''}`}
  onClick={() => setSelectedCategory(null)}
>
  <h3>All Products</h3>
  <p>View our complete collection</p>
</div>

{categories.map(category => (
  <div 
    key={category.id} 
    className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
    onClick={() => setSelectedCategory(category.id)}
  >
    <h3>{category.name}</h3>
    <p>{category.description}</p>
  </div>
))}
</div>
</section>

{/* Products Section */}
<section className="products-section" id="products">
<h2>Our Products</h2>
{selectedCategory !== null && (
<div className="selected-category">
  <h3>{categories.find(c => c.id === selectedCategory)?.name}</h3>
  <p>{categories.find(c => c.id === selectedCategory)?.description}</p>
</div>
)}

<div className="products-grid">
{filteredProducts.map(product => (
  <div className="product-card" key={product.id}>
    <div className="product-image">
      <img src={product.image} alt={product.name} />
    </div>
    <div className="product-info">
      <h3>{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <p className="product-short-desc">{product.description.substring(0, 70)}...</p>
      <div className="product-actions">
        <button 
          className="btn-view" 
          onClick={() => setSelectedProduct(product)}
        >
          View Details
        </button>
        <button 
          className="btn-add-to-cart"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
))}
</div>
</section>

{/* Product Modal */}
{selectedProduct && (
<div className="product-modal">
<div className="modal-content">
  <span className="close-modal" onClick={() => setSelectedProduct(null)}>&times;</span>
  <div className="modal-body">
    <div className="modal-image">
      <img src={selectedProduct.image} alt={selectedProduct.name} />
    </div>
    <div className="modal-details">
      <h3>{selectedProduct.name}</h3>
      <p className="modal-price">${selectedProduct.price}</p>
      <p className="category-tag">
        {categories.find(c => c.id === selectedProduct.category)?.name}
      </p>
      <p className="modal-description">{selectedProduct.description}</p>
      <button 
        className="btn-add-to-cart"
        onClick={() => {
          addToCart(selectedProduct);
          setSelectedProduct(null);
        }}
      >
        Add to Cart
      </button>
    </div>
  </div>
</div>
</div>
)}

{/* Cart Sidebar */}
<div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
<div className="cart-header">
<h3>Your Cart</h3>
<span className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</span>
</div>

<div className="cart-items">
{cart.length === 0 ? (
  <p className="empty-cart">Your cart is empty</p>
) : (
  <>
    {cart.map(item => (
      <div className="cart-item" key={item.id}>
        <div className="cart-item-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="cart-item-details">
          <h4>{item.name}</h4>
          <p>${item.price} × {item.quantity}</p>
        </div>
        <button 
          className="remove-item"
          onClick={() => removeFromCart(item.id)}
        >
          &times;
        </button>
      </div>
    ))}
    
    <div className="cart-total">
      <p>Total: <span>${totalPrice}</span></p>
    </div>
    
    <button className="btn-checkout">Proceed to Checkout</button>
  </>
)}
</div>
</div>

{/* Testimonials Section */}
<section className="testimonials-section">
<h2>What Our Customers Say</h2>
<div className="testimonials-container">
<div className="testimonial">
  <p>"The quality of products I received was exceptional. Will definitely shop again!"</p>
  <p className="customer-name">- Sarah J.</p>
</div>
<div className="testimonial">
  <p>"Fast shipping and excellent customer service. Highly recommend!"</p>
  <p className="customer-name">- Michael T.</p>
</div>
<div className="testimonial">
  <p>"I love the variety of products available. Something for everyone!"</p>
  <p className="customer-name">- Lisa R.</p>
</div>
</div>
</section>

{/* Footer */}
<footer className="footer">
<div className="footer-content">
<div className="footer-section">
  <h3>Your Brand</h3>
  <p>Providing quality products since 2010</p>
</div>
<div className="footer-section">
  <h3>Quick Links</h3>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#products">Products</a></li>
    <li><a href="#about">About Us</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</div>
<div className="footer-section">
  <h3>Contact Us</h3>
  <p>Email: info@yourbrand.com</p>
  <p>Phone: (555) 123-4567</p>
</div>
</div>
<div className="footer-bottom">
<p>&copy; 2025 Your Brand. All rights reserved.</p>
</div>
</footer>
</div>
);
};