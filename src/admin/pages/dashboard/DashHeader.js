import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import moment from 'moment';
import CustomDropDown from '../../components/DropDown';
import DateRange from '../../components/DateRange';
import { getStores } from 'Apis/Elastic';

const DashHeader = ({
  selectedStore,
  changeStore,
  dateRange,
  changeDateRange,
}) => {
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  const [storeOptions, setStoreOptions] = useState([]);

  useEffect(() => {
    let unmounted = false;
    if (userInfo.id >= 0) {
      getStores(userInfo.id).then((res) => {
        if (!unmounted) {
          if (res.length > 0) {
            changeStore({ id: 'all', name: 'All' });
            setStoreOptions([{ id: 'all', name: 'All' }, ...res]);
          } else {
            changeStore(null);
            setStoreOptions([]);
          }
        }
      });
    }
    return () => {
      unmounted = true;
    };
  }, [userInfo.id]); // eslint-disable-line

  return (
    <ComponentContianer>
      <h1 className="title">Dashboard</h1>
      <CustomDropDown
        id="dashboard-store-selector"
        value={selectedStore}
        options={storeOptions}
        onChange={(store) => {
          changeStore(store);
        }}
      />

      <DateRange
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={changeDateRange}
        ranges={{
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days'),
          ],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month'),
          ],
        }}
        style={{ marginLeft: 'auto' }}
      />
    </ComponentContianer>
  );
};

const ComponentContianer = styled.div`
  display: flex;

  .title {
    font-weight: 600;
    font-size: 34px;
    line-height: 41px;
    margin: 0 21px 0 0;
  }
`;

export default DashHeader;
