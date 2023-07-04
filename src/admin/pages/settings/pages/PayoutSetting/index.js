import React, { useState } from 'react';

import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import AppContainer from '../../../../components/AppContainer';
import CustomRadio from 'sharedComponents/CustomRadio';
import Checkbox from '../../../../components/Checkbox';

const PayoutSetting = () => {
  const [formData, setFormData] = useState({
    everyBusinessDay: true,
    notifyMe: true,
  });

  return (
    <AppContainer>
      <ComponentContainer className="p-4">
        <TopHeader>
          <h1>Trade Sprint Payments</h1>
          <SaveButton className="ht-btn-primary">Save</SaveButton>
        </TopHeader>
        <MainCard className="ht-card">
          <h6>Payout Frequency</h6>
          <CustomRadio
            id="every-business-day"
            name="every-business-day"
            label="Every Business Day"
            checked={formData.everyBusinessDay}
            onChange={(e) => {
              setFormData({
                ...formData,
                everyBusinessDay: !formData.everyBusinessDay,
              });
            }}
          />
          <p>It may 2-3 working days to arrive in your account.</p>
          <hr />
          <Checkbox
            id="notify-me"
            checked={formData.notifyMe}
            onChange={(e) => {
              setFormData({
                ...formData,
                notifyMe: e.target.checked,
              });
            }}
          >
            Notify me
          </Checkbox>
          <p>Get notified every time you receive a payout.</p>
        </MainCard>
      </ComponentContainer>
    </AppContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 974px;
  margin: 0 auto;
  padding: 40px 0 120px;
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
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 36px 40px;
  margin: 97px 0 0 0;
  h6 {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
  }
  .bug-radio {
    margin: 41px 0 6px;
    .custom-control-label {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
    }
  }
  hr {
    margin-top: 100px;
    margin-bottom: 28px;
  }
  .checkbox-span {
    width: 24px;
    height: 24px;
  }
  .checkbox-label {
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
  }
  p {
    padding-left: 47px;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
  }
`;

const SaveButton = styled(Button)`
  margin-left: auto;
`;

export default PayoutSetting;
