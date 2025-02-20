import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import { useLocation,
useNavigate
} from 'react-router-dom';

import '../../styles/cart/cart.scss';

export default function Cart() {

  const location = useLocation();
  const navigate = useNavigate();

 return (
  <Col id="cart">
    <Col id="cart-cartcontainer">
      <Col id="cart-navigationcontainer">
        <p className="cart-navigationcontainer-headerindication"><span className="cart-navigationcontainer-headerindication-spanheaderindication"
                                                                        onClick={()=> {
                                                                          navigate('/market')
                                                                        }}>Home /</span><span className="cart-navigationcontainer-headerindication-spanheaderindication">Back /</span></p>
      </Col>
      <Col id="cart-headerindicationcontainer">
        <img src="../images/cart/cart.jpg"
            id="cart-headerindicationcontainer-headerdisplayimage"/>
      </Col>
      <Col id="cart-cartcolcontainer">
        <Row id="cart-cartrowcontainer">
          <Col xs={12}
              md={8}
              lg={8}
              id="cart-cartrowcontainer-productdetailscontainer">
              <h1 id="cart-cartrowcontainer-productdetailscontainer-shoppingcartheaderindication">Shopping cart</h1>
            <Row className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer">
              <Col xs={1}
                  md={1}
                  lg={1}
                  className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-deletefromcartcontainer">
                <p className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-deletefromcartcontainer-deletefromcartheaderindication">x</p>
              </Col>
              <Col xs={2}
                  md={2}
                  lg={2}
                  className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-productdisplayimagecontainer">
                <img src="../images/cart/cart.jpg"
                    className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-productdisplayimagecontainer-productdisplayimage"/>
              </Col>
              <Col xs={4}
                  md={4}
                  lg={4}
                  className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-productnamecontainer">
                  <p className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-productnamecontainer-productnameheaderindication">PRODUCT NAME</p>
              </Col>
              <Col xs={3}
                  md={3}
                  lg={3}
                  className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-quantitycontainer">
                <p className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-quantitycontainer-qtyheaderindication">Quantity: <input type="number" className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-quantitycontainer-qtyheaderindication-inputfield"></input></p>
              </Col>
              <Col xs={2}
                  md={2}
                  lg={2}
                  className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-pricingcontainer">
                <p className="cart-cartrowcontainer-productdetailscontainer-productorderdetailsrowcontainer-pricingcontainer-pricingheaderindication">$780</p>
              </Col>
            </Row>
          </Col>
          <Col xs={12}
              md={4}
              lg={4}
              id="cart-cartrowcontainer-shippingdetailscontainer">
            <h4 id="cart-cartrowcontainer-shippingdetailscontainer-carttotalsheaderindication">CART TOTALS</h4>
            <p>SUBTOTAL <span>$1,104</span></p>
            <p>SHIPPING TOTAL <span>3 kilos equal to $1,104 / 100 peso's per 1 kilo</span></p>
            <h4>TOTAL <span>$1,104</span></h4>
          </Col>
        </Row>
      </Col>
      <Row id="cart-paymentdetailscontainer">
      <Col xs={12}
           md={12}
           lg={12}
           className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h1 className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">PERSONAL INFORMATION</h1>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">First name: Fullname</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Middle name: Fullname</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Last name: Fullname</p>
        </Col>
        <Col xs={6}
             md={6}
             lg={6}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Region: <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Street address: <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Baranggay <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield" /></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">City <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Town / City <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Country <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Postcode / Zip <input type="text" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <p className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Phone number <input type="number" className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication-addressinputfield"/></p>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h1 className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">PAYMENT DETAILS</h1>
         
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h4>OMSIAPAWASTO</h4>
          <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer">
             <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton"
                  onClick={(evt)=> {

                    const _togglebutton = evt.target;
                    const _alltogglebutton = document.querySelectorAll('.cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton');

                    for (let i = 0; i < _alltogglebutton.length; i++) {
                      _alltogglebutton[i].style.left = "0%"
                      _alltogglebutton[i].style.backgroundColor = "black";
                    }

                    if ( _togglebutton.style.left === "0%" ) {
                      _togglebutton.style.left = "50%";
                      _togglebutton.style.backgroundColor = "dodgerblue";
                    } else {
                     _togglebutton.style.left = "0%";
                     _togglebutton.style.backgroundColor = "black";
                    }
                   
                  }}>

             </div>
          </div>
        </Col>

        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h4>FUNDS</h4>
          <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer">
             <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton"
                  onClick={(evt)=> {

                    const _togglebutton = evt.target;
                    const _alltogglebutton = document.querySelectorAll('.cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton');

                    for (let i = 0; i < _alltogglebutton.length; i++) {
                      _alltogglebutton[i].style.left = "0%"
                      _alltogglebutton[i].style.backgroundColor = "black";
                    }
   
                    if ( _togglebutton.style.left === "0%" ) {
                      _togglebutton.style.left = "50%";
                      _togglebutton.style.backgroundColor = "dodgerblue";
                    } else {
                     _togglebutton.style.left = "0%";
                     _togglebutton.style.backgroundColor = "black";
                    }
                   
                  }}>

             </div>
          </div>
        </Col>

        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h4>OMSIAPAWASTO + FUNDS</h4>
          <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer">
             <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton"
                  onClick={(evt)=> {

                    const _togglebutton = evt.target;
                    const _alltogglebutton = document.querySelectorAll('.cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton');

                    for (let i = 0; i < _alltogglebutton.length; i++) {
                      _alltogglebutton[i].style.left = "0%"
                      _alltogglebutton[i].style.backgroundColor = "black";
                    }
   
                    if ( _togglebutton.style.left === "0%" ) {
                      _togglebutton.style.left = "50%";
                      _togglebutton.style.backgroundColor = "dodgerblue";
                    } else {
                     _togglebutton.style.left = "0%";
                     _togglebutton.style.backgroundColor = "black";
                    }
                   
                  }}>

             </div>
          </div>
        </Col>

        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h4>FUNDS + OMSIAPAWASTO</h4>
          <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer">
             <div className="cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton"
                  onClick={(evt)=> {

                    const _togglebutton = evt.target;
                    const _alltogglebutton = document.querySelectorAll('.cart-paymentdetailscontainer-paymentdetailscontainer-paymenttogglebuttoncontainer-togglebutton');

                    for (let i = 0; i < _alltogglebutton.length; i++) {
                      _alltogglebutton[i].style.left = "0%"
                      _alltogglebutton[i].style.backgroundColor = "black";
                    }
   
                    if ( _togglebutton.style.left === "0%" ) {
                      _togglebutton.style.left = "50%";
                      _togglebutton.style.backgroundColor = "dodgerblue";
                    } else {
                     _togglebutton.style.left = "0%";
                     _togglebutton.style.backgroundColor = "black";
                    }
                   
                  }}>

             </div>
          </div>
        </Col>

        <Col xs={12}
             md={12}
             lg={12}
             className="cart-paymentdetailscontainer-paymentdetailscontainer">
          <h4 className="cart-paymentdetailscontainer-paymentdetailscontainer-paymentdetailsheaderindication">Error message</h4>
        </Col>

        <Col id="cart-paymentdetailscontainer-paymentdetailscontainer-placeorderbuttoncontainer">
          <button id="cart-paymentdetailscontainer-paymentdetailscontainer-placeorderbuttoncontainer-placeorderbutton">PLACE ORDER</button>
        </Col>  
       
      </Row>
    </Col>
   
  </Col>
 )
}