import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import get from 'lodash/get';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import queryString from 'query-string';
import moment from 'moment';
import AppContainer from '../../components/AppContainer';
import DashHeader from './DashHeader';
import TopSection from './TopSection';
import OrderChart from './OrderChart';
import RevenueType from './RevenueType';
import TopMenuItems from './TopMenuItems';
import setAuthToken from 'utils/setAuthToken';
import { filterOrders } from 'Apis/Elastic';

const Dashboardpage = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  const [selectedStore, setStore] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).startOf('day'),
    endDate: moment(new Date()).startOf('day'),
  });

  const [orderList, setOrderList] = useState([]);
  const [prevOrderList, setPrevOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.token) {
      setAuthToken(query.token);
    }
  }, []); // eslint-disable-line

  const getOrderData = async () => {
    setLoading(true);
    const startDate = dateRange.startDate.startOf('day').valueOf();
    const endDate = dateRange.endDate.endOf('day').valueOf();

    const resCurrent = await filterOrders({
      store_id: selectedStore.id,
      status: 4,
      start: startDate,
      end: endDate,
      user_id: userInfo.id,
    });
    setOrderList([...resCurrent]);

    const diff = moment(endDate).diff(moment(startDate), 'days') + 1;
    const prevStartDate = moment(startDate)
      .subtract(diff, 'days')
      .startOf('day');
    const prevEndDate = moment(startDate).subtract(1, 'days').endOf('day');

    const rePrev = await filterOrders({
      store_id: selectedStore.id,
      status: 4,
      start: prevStartDate.valueOf(),
      end: prevEndDate.valueOf(),
      user_id: userInfo.id,
    });
    setPrevOrderList([...rePrev]);

    setLoading(false);
  };

  useEffect(() => {
    if (get(userInfo, 'id', -1) >= 0 && get(selectedStore, 'id', null) !== null)
      getOrderData();
    else setLoading(false);
  }, [dateRange, selectedStore, userInfo]); // eslint-disable-line

  return (
    <AppContainer>
      <MainContainer className="main-container">
        <DashHeader
          selectedStore={selectedStore}
          changeStore={setStore}
          dateRange={dateRange}
          changeDateRange={(d) => {
            setDateRange({ ...d });
          }}
        />
        <TopSection
          dateRange={dateRange}
          orderList={orderList}
          prevOrderList={prevOrderList}
        />

        <OrderChart
          dateRange={dateRange}
          propOrderList={orderList}
          loading={loading}
        />

        <CustomRow>
          <TopMenuItems orderList={orderList} loading={loading} />
          <RevenueType orderList={orderList} loading={loading} />
        </CustomRow>
      </MainContainer>
    </AppContainer>
  );
};

const MainContainer = styled(Container)`
  margin-top: 51px;
  margin-bottom: 122px;
`;

const CustomRow = styled.div`
  display: flex;
  margin: 49px 0 0 0;
`;

export default Dashboardpage;
