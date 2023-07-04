import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import styled from 'styled-components';
import { Container, Card, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

import ApiService from 'admin/ApiService';
import AppContainer from '../../../../components/AppContainer';
import HtSpinner from '../../../../components/HtSpinner';
import { RunToast } from 'utils/toast';

import { getToken, ADYEN_PAYOUT_SCHEDULE_OPTIONS } from 'constants/constants';

const PayoutSchedule = () => {
  const [accountInfo, setAccountInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService({
      method: 'GET',
      url: '/adyen/account/payoutschedule',
      ...getToken(),
    })
      .then((res) => {
        if (res.data.success) {
          setAccountInfo({
            ...res.data.accounts[0],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const getScheduleOptionValue = () => {
    const payoutSchedule = _.get(accountInfo, 'payoutSchedule', null);

    if (null) return {};

    const schedule = _.get(payoutSchedule, 'schedule', '');
    return { label: schedule, value: schedule };
  };
  const handleClickUpdate = () => {
    setLoading(true);
    ApiService({
      method: 'POST',
      url: '/adyen/account/payoutschedule',
      data: { schedule: accountInfo.payoutSchedule.schedule },
      ...getToken(),
    })
      .then((res) => {
        setLoading(false);
        if (res.data.success) RunToast('success', 'Payout schedule updated');
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', 'Payout schedule update failed');
      });
  };

  return (
    <AppContainer>
      <MenuContainer>
        <TopHeader>
          <h1>Trade Sprint Payments</h1>
          <UpdateButton
            className="ht-btn-primary"
            // className={`ht-btn-primary ${
            //   checkPrimaryButtonStatus() ? '' : 'ht-btn-primary-disable'
            // }`}
            onClick={handleClickUpdate}
          >
            Update Payout Schedule
          </UpdateButton>
        </TopHeader>
        <MainCard className="ht-card">
          <Form.Group>
            <Form.Label className="ht-label">Payout duration</Form.Label>
            <Select
              options={ADYEN_PAYOUT_SCHEDULE_OPTIONS}
              value={getScheduleOptionValue()}
              onChange={(e) => {
                setAccountInfo({
                  ...accountInfo,
                  payoutSchedule: {
                    schedule: e.value,
                  },
                });
              }}
              classNamePrefix="select"
              className="ht-selector"
              placeholder="Select payout schedule"
              // value={{value: adyenInfo.account_code, label: }}
            />
          </Form.Group>
        </MainCard>
        {loading && <HtSpinner />}
      </MenuContainer>
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  max-width: 974px;
`;

const TopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-contents: space-around;
  h1 {
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    margin: 0;
  }
`;

const MainCard = styled(Card)`
  padding: 40px 60px;
  margin: 70px auto 0;
  width: 100%;
  max-width: 772px;
`;

const UpdateButton = styled(Button)`
  margin-left: auto;
`;

export default PayoutSchedule;
