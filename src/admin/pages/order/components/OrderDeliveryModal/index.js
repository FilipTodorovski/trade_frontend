import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import TimeField from 'react-simple-timefield';
import moment from 'moment';
import CustomOutlinedButton from 'sharedComponents/CustomOutlinedButton';

const OrderDeliveryModal = ({ isShow, onHide, requestDate, updateDate }) => {
  const [deliveryTime, setDeliveryTime] = useState(
    moment(new Date(requestDate))
  );

  const getTimeLeft = () => {
    const curDate = moment(new Date());
    const deliveryTemp = moment(new Date());
    deliveryTemp.set({
      hour: deliveryTime.hours(),
      minute: deliveryTime.minutes(),
    });

    const duaration = moment.duration(deliveryTemp.diff(curDate));
    const minutes = Math.floor(duaration.asMinutes());

    return minutes;
  };

  useEffect(() => {
    if (!requestDate) return;

    const deliveryMoment = moment(new Date(requestDate));
    setDeliveryTime(deliveryMoment);
  }, [requestDate]);

  const onTimeChange = (event, value) => {
    const defaultTime = moment(new Date());
    const newTime = value.replace(/-/g, ':');
    const timeValue = newTime.split(':');

    const deliveryTimeTemp = defaultTime.set({
      hour: timeValue[0],
      minute: timeValue[1],
    });

    setDeliveryTime(deliveryTimeTemp);
  };

  const onClickPlus = () => {
    const deliveryTemp = moment(deliveryTime.valueOf());
    deliveryTemp.add(15, 'minutes');
    setDeliveryTime(deliveryTemp);
  };

  const onClickMinus = () => {
    const deliveryTemp = moment(deliveryTime.valueOf());
    deliveryTemp.subtract(15, 'minutes');
    setDeliveryTime(deliveryTemp);
  };

  const updateDeliveryTime = () => {
    const curDate = moment(new Date());
    curDate.set({
      hour: deliveryTime.hours(),
      minute: deliveryTime.minutes(),
      second: 0,
      millisecond: 0,
    });
    updateDate(curDate.valueOf());
  };

  return (
    <OrderDeliverModalContainer>
      <Modal
        show={isShow}
        onHide={onHide}
        size="lg"
        centered
        backdrop="static"
        className="order-delivery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delivery for {deliveryTime.format('HH:mm')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Update requested time?</h4>
          <div className="time-selector">
            <CustomOutlinedButton onClick={onClickMinus}>
              -
            </CustomOutlinedButton>
            <div className="set-time-area">
              <TimeField
                value={deliveryTime.format('HH:mm')}
                onChange={onTimeChange}
                input={<CustomTimeInputElement />}
              />
              <span className="time-left">{`${getTimeLeft()} min`}</span>
            </div>
            <CustomOutlinedButton onClick={onClickPlus}>+</CustomOutlinedButton>
          </div>
          <p
            className="validate-msg"
            style={{ visibility: getTimeLeft() < 0 ? 'visible' : 'hidden' }}
          >
            Your order request time already passed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={`ht-btn-primary ${
              getTimeLeft() < 0 ? 'ht-btn-primary-disable' : ''
            }`}
            onClick={() => updateDeliveryTime()}
          >
            Delivery by {deliveryTime.format('HH:mm')}
          </Button>
        </Modal.Footer>
      </Modal>
    </OrderDeliverModalContainer>
  );
};

const OrderDeliverModalContainer = styled.div`
  display: flex;
  h4 {
    margin: 0;
  }
`;

const CustomTimeInputElement = styled.input`
  width: 90px;
  font-size: 30px;
  border: none;
  outline: none;
  text-align: center;
`;

export default OrderDeliveryModal;
