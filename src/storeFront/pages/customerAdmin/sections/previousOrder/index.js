import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { PRIMARY_DARK_COLOR } from 'constants/constants';
import { getCustomerOrdersApi } from 'Apis/CustomerApis';
import OrderCard from 'admin/pages/order/components/OrderCard';
import HtSpinner from 'admin/components/HtSpinner';

const PreviousOrderSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let unmounted = false;

    const getOrders = async () => {
      getCustomerOrdersApi()
        .then((res) => {
          if (!unmounted) {
            setLoading(false);
            setOrders([...res.data.orders]);
          }
        })
        .catch((err) => {
          if (!unmounted) {
            setLoading(false);
            setOrders([]);
          }
        });
    };

    getOrders();
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <ComponentContainer>
      <Title>Previous Orders</Title>
      {!showAll && (
        <RevieAllOrder
          onClick={() => {
            setShowAll(true);
          }}
          role="button"
        >
          Review all your previous orders
        </RevieAllOrder>
      )}
      {orders.map((item, idx) => {
        if (!showAll && idx > 0) return null;
        return <OrderCard orderInfo={item} key={idx} />;
      })}

      {loading && <HtSpinner />}
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  flex: 1 1 100%:
  flex-direction: column;
  align-items: stretch
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 41px;
  color: ${PRIMARY_DARK_COLOR};
`;

const RevieAllOrder = styled.h4`
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 42px;
  color: ${PRIMARY_DARK_COLOR};
  cursor: poiner;
`;

export default PreviousOrderSection;
