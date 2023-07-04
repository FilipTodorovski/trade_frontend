import React from 'react';
import styled from 'styled-components';
import { Form, InputGroup } from 'react-bootstrap';
import Checkbox from '../../../../components/Checkbox';
import DeliveryAreaFeesMap from './DeliveryAreaFeesMap';
import * as CONSTANTS from 'constants/constants';

const AreaFeesSection = ({ store, setStore, storeValidate, saveStore }) => {
  return (
    <>
      <FullfillmentContainer className="ht-card">
        <h5>Fullfillment type</h5>
        <Checkbox
          id="fullfill-delivery"
          onChange={(e) => {
            setStore({
              ...store,
              fullfillment_type: {
                ...store.fullfillment_type,
                delivery: e.target.checked,
              },
            });
          }}
          checked={store.fullfillment_type.delivery}
          style={{ marginTop: '30px' }}
        >
          Enable delivery
        </Checkbox>
        <Checkbox
          id="pickup"
          onChange={(e) => {
            setStore({
              ...store,
              fullfillment_type: {
                ...store.fullfillment_type,
                pickup: e.target.checked,
              },
            });
          }}
          checked={store.fullfillment_type.pickup}
          style={{ marginTop: '30px' }}
        >
          Do you accept pickup?
        </Checkbox>
      </FullfillmentContainer>
      <DeliveryTimeContainer className="ht-card">
        <h5>Delivery & Time</h5>
        <Form.Group className="ht-formgroup-description">
          <Form.Label className="ht-label">Minimum delivery amount</Form.Label>
          <p className="label-description">
            Prevent customers from ordering delivery unless they spend a certain
            amount
          </p>
          <InputGroup className="ht-inputgroup">
            <InputGroup.Prepend>
              <InputGroup.Text>£</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="number"
              className="ht-form-control text-right"
              placeholder="10"
              value={store.minimum_delivery_amount}
              onChange={(e) => {
                setStore({
                  ...store,
                  minimum_delivery_amount: e.target.value,
                });
              }}
              isInvalid={!storeValidate.minimum_delivery_amount.validate}
            />
          </InputGroup>
          {!storeValidate.minimum_delivery_amount.validate && (
            <div className="ht-invalidate-label">
              {storeValidate.minimum_delivery_amount.errorMsg}
            </div>
          )}
        </Form.Group>

        <Form.Group className="ht-formgroup-description">
          <Form.Label className="ht-label">Delivery prep time</Form.Label>
          <p className="label-description">
            The average time it takes to prep a delivery order
          </p>
          <InputGroup className="ht-inputgroup">
            <Form.Control
              type="number"
              className="ht-form-control"
              placeholder="10"
              value={store.delivery_prep_time}
              onChange={(e) => {
                setStore({
                  ...store,
                  delivery_prep_time: e.target.value,
                });
              }}
              isInvalid={!storeValidate.delivery_prep_time.validate}
            />
            <InputGroup.Append>
              <InputGroup.Text>min</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          {!storeValidate.delivery_prep_time.validate && (
            <div className="ht-invalidate-label">
              {storeValidate.delivery_prep_time.errorMsg}
            </div>
          )}
        </Form.Group>

        <Form.Group className="ht-formgroup-description">
          <Form.Label className="ht-label">Pickup Prep time</Form.Label>
          <p className="label-description">
            The average time it takes to prep a pickup order
          </p>
          <InputGroup className="ht-inputgroup">
            <Form.Control
              type="number"
              className="ht-form-control"
              placeholder="10"
              aria-describedby="delivery-amount"
              value={store.pickup_prep_time}
              onChange={(e) => {
                setStore({
                  ...store,
                  pickup_prep_time: e.target.value,
                });
              }}
              isInvalid={!storeValidate.pickup_prep_time.validate}
            />
            <InputGroup.Append>
              <InputGroup.Text>min</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          {!storeValidate.pickup_prep_time.validate && (
            <div className="ht-invalidate-label">
              {storeValidate.pickup_prep_time.errorMsg}
            </div>
          )}
        </Form.Group>
      </DeliveryTimeContainer>
      <DeliveryAreaFeesContainer className="ht-card">
        <h5 className="card-title">Delivery areas and fees</h5>
        <DeliveryAreaFeesMap
          store={store}
          setStore={setStore}
          saveStore={saveStore}
        />
      </DeliveryAreaFeesContainer>
    </>
  );
};

const FullfillmentContainer = styled.div`
  padding: 40px 40px 50px;
  h5 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0;
  }
`;

const DeliveryTimeContainer = styled(FullfillmentContainer)`
  margin-top: 60px;
  h5 {
    margin-bottom: 5px;
  }
  .ht-formgroup-description {
    margin-top: 25px;
    .ht-inputgroup {
      width: 235px;
    }
  }
`;

const DeliveryAreaFeesContainer = styled(FullfillmentContainer)`
  margin-top: 60px;
  h5 {
    margin-bottom: 40px;
  }
`;

export default AreaFeesSection;
