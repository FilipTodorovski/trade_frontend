import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import { checkIsInDayHours } from 'utils/menu';
import * as types from '../../../../actions/actionTypes';

const DeliveryFromModal = ({ isShow, hideModal }) => {
  const dispatch = useDispatch();

  const { storeInfo, deliveryInfo } = useSelector((state) => ({
    storeInfo: state.storeFrontReducer.store,
    deliveryInfo: state.storeFrontReducer.deliveryData,
  }));

  const [deliveryData, setDeliveryData] = useState({
    ...deliveryInfo,
  });

  useEffect(() => {
    setDeliveryData({
      ...deliveryInfo,
    });
  }, [deliveryInfo]);

  const renderTimePickers = (day) => {
    let dayIndex;
    if (day === 0 || day === 1) {
      dayIndex = new Date().getDay();
    } else {
      dayIndex = moment(new Date()).add(1, 'days').day();
    }

    const dayStart = moment(new Date()).startOf('day');
    const dayEnd = moment(new Date()).endOf('day');
    if (day === 2) {
      dayStart.add(1, 'days');
      dayEnd.add(1, 'days');
    }
    const render = [];
    for (
      let i = dayStart.valueOf();
      i + 15 * 60 * 1000 <= dayEnd.valueOf();
      i += 15 * 60 * 1000
    ) {
      if (checkIsInDayHours(storeInfo, dayIndex, moment(i).valueOf())) {
        const momentSelected = moment(i);
        render.push(
          <option key={i} value={i}>{`${momentSelected.format(
            'HH: mm'
          )} - ${momentSelected.add(30, 'minutes').format('HH:mm')}`}</option>
        );
      }
    }
    return render;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    dispatch({
      type: types.UPDAGTE_DELIVERY_INFO,
      payload: {
        ...deliveryData,
        data: {
          ...deliveryData.data,
          value:
            deliveryData.data.day === 0
              ? new Date()
              : parseInt(form.elements.timeSelector.value),
        },
      },
    });
    hideModal();
  };

  return (
    <Modal
      show={isShow}
      onHide={() => {
        hideModal();
      }}
      centered
    >
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <h3 className="mb-0">When</h3>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <ClickFormGroup
              as={Col}
              onClick={() => {
                setDeliveryData({
                  ...deliveryData,
                  data: {
                    ...deliveryData.data,
                    day: 0,
                    value: 0,
                  },
                });
              }}
              active={deliveryData.data.day === 0}
            >
              <svg height="24" width="24" viewBox="0 0 24 24">
                <path d="M16.6318 5.28178L15.8 4.45L17.55 2.7L22.8 7.95L21.05 9.7L19.7182 8.36822C20.532 9.72134 21 11.306 21 13C21 17.9706 16.9706 22 12 22C7.02945 22 3 17.9706 3 13C3 8.02945 7.02945 4 12 4C13.694 4 15.2787 4.46801 16.6318 5.28178ZM12 20C15.8598 20 19 16.8598 19 13C19 9.14016 15.8598 6 12 6C8.14016 6 5 9.14016 5 13C5 16.8598 8.14016 20 12 20ZM14 15H8.5V13H12V9H14V15ZM8 4V2H16V4H8Z"></path>
              </svg>
              Now
              <Form.Check
                className="ml-auto"
                type="radio"
                checked={deliveryData.data.day === 0}
              />
            </ClickFormGroup>
          </Row>
          <Row className="d-flex flex-column mb-2">
            <ClickFormGroup
              as={Col}
              onClick={() => {
                deliveryData.data.day === 0
                  ? setDeliveryData({
                      ...deliveryData,
                      data: {
                        ...deliveryData.data,
                        day: 1,
                        value: 0,
                      },
                    })
                  : setDeliveryData({ ...deliveryData });
              }}
              active={
                deliveryData.data.day === 1 || deliveryData.data.day === 2
              }
            >
              <svg height="24" width="24" viewBox="0 0 24 24">
                <path d="M13 12L15.2025 15.8789L13.4704 16.8789L11 12.6V6H13V12ZM12 2C17.5228 2 22 6.47717 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47717 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20Z"></path>
              </svg>
              Later
              <Form.Check
                className="ml-auto"
                type="radio"
                checked={
                  deliveryData.data.day === 1 || deliveryData.data.day === 2
                }
              />
            </ClickFormGroup>
            {(deliveryData.data.day === 1 || deliveryData.data.day === 2) && (
              <Col className="d-flex justify-contents-between mt-3">
                <Form.Control
                  as="select"
                  custom
                  value={deliveryData.data.day}
                  onChange={(e) => {
                    setDeliveryData({
                      ...deliveryData,
                      data: {
                        ...deliveryData.data,
                        day: parseInt(e.target.value),
                        value: 0,
                      },
                    });
                  }}
                  className="mr-1"
                >
                  <option value={1} key="today">
                    Today
                  </option>
                  <option value={2} key="tomorrow">
                    Tomorrow
                  </option>
                </Form.Control>
                <Form.Control
                  as="select"
                  className="ml-1"
                  controlId="timeSelector"
                  name="timeSelector"
                >
                  {renderTimePickers(deliveryData.data.day)}
                </Form.Control>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <CustomModalFooter>
          <Button
            variant="outline-primary"
            onClick={() => {
              hideModal();
            }}
            className="btn-close ht-btn-outline-primary"
          >
            Close
          </Button>
          <Button type="submit" className="btn-update ht-btn-primary">
            Update
          </Button>
        </CustomModalFooter>
      </Form>
    </Modal>
  );
};

const ClickFormGroup = styled(Form.Group)`
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: ${(props) => (props.active ? 1 : 0.7)};
  font-size: 1rem;
  margin-top: 1em;
  svg {
    margin-right: 5px;
    fill: #292d32;
  }
`;

const CustomModalFooter = styled(Modal.Footer)`
  display: flex;
  flex-wrap: nowrap;
  .btn-close {
    flex: 1 2 100%;
  }
  .btn-update {
    flex: 1 1 100%;
  }
`;

export default DeliveryFromModal;
