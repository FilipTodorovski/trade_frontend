import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import * as CONSTANTS from '../../../../constants';
import OrderCard from '../../components/OrderCard';
import HtSpinner from '../../../../components/HtSpinner';

const NewOrderSection = ({ storeId }) => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios({
      method: 'GET',
      url: `/order/${storeId}`,
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          setOrderList([...res.data.orders]);
        }
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

  return (
    <SectionContainer>
      {/* {orderList.map((item, nIndex) => {
        <OrderCard
          orderInfo={item}
          curSection={CONSTANTS.ORDER_NEW}
          key={nIndex}
        />;
      })} */}
      {loading && <HtSpinner />}
    </SectionContainer>
  );
};

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default NewOrderSection;
