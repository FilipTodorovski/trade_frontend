import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Row, Col } from 'react-bootstrap';
import ProductList from './ProductList';
import Checkout from './Checkout';
import CheckoutMenu from './Checkout/CheckoutMenu';

const MenuSection = () => {
  const { store, orderList } = useSelector((state) => ({
    store: state.storeFrontReducer.store,
    orderList: state.storeFrontReducer.orderList,
  }));

  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Row>
      <Col lg="8">
        <div id="product-list-container" className="d-flex flex-column pt-4">
          {store.menu &&
            store.menu.categories &&
            store.menu.categories.map((item) => {
              return <ProductList categoryInfo={item} key={item.id} />;
            })}
        </div>
      </Col>
      <Col lg="4">
        {mobileView && orderList.length > 0 && <CheckoutMenu />}
        {!mobileView && <Checkout />}
      </Col>
    </Row>
  );
};

export default MenuSection;
