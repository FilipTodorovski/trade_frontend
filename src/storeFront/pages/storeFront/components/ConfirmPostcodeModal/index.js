import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import get from 'lodash/get';
import { postcodeValidator } from 'postcode-validator';
import { Modal, Form, Button } from 'react-bootstrap';
import { checkDayStoreStatus } from 'utils/menu';
import { getDeliveryFee } from 'utils/store';
import * as types from '../../../../actions/actionTypes';
import { PRIMARY_DARK_COLOR } from 'constants/constants';

const POSTCODE_CONFIRM_VIEW = 0;
const POSTCODE_SORRY_VIEW = 1;
const POSTCODE_STORE_OPENED = 2;
const POSTCODE_STORE_CLOSED = 3;

const ConfirmPostcodeModal = ({ isShow, hideModal, storeInfo }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [curPage, setCurPage] = useState(POSTCODE_CONFIRM_VIEW);
  const [postcode, setPostcode] = useState({
    value: '',
    validate: true,
    errorMsg: '',
  });

  useEffect(() => {
    if (isShow) {
      setCurPage(POSTCODE_CONFIRM_VIEW);
      setPostcode({
        value: '',
        validate: true,
        errorMsg: '',
      });
    }
  }, [isShow]);

  const clickSearch = async () => {
    if (postcode.value.length === 0) {
      setPostcode({
        ...postcode,
        validate: false,
        errorMsg: 'Please input postcode.',
      });
    } else if (postcodeValidator(postcode.value.trim(), 'UK')) {
      setPostcode({
        postcode: postcode.value.trim(),
        validate: true,
        errorMsg: '',
      });

      const feeValue = await getDeliveryFee(storeInfo, postcode.value);
      if (feeValue >= 0) {
        const curDate = new Date();
        const curDateStoreStatus = checkDayStoreStatus(storeInfo, curDate);

        if (curDateStoreStatus.status === 0) {
          setCurPage(POSTCODE_STORE_CLOSED);
        } else if (curDateStoreStatus.status === 1) {
          dispatch({
            type: types.UPDAGTE_DELIVERY_INFO,
            payload: { postcode: postcode.value },
          });
          hideModal();
        } else if (curDateStoreStatus.status === 2) {
          setCurPage(POSTCODE_STORE_OPENED);
        }
      } else {
        setCurPage(POSTCODE_SORRY_VIEW);
        setPostcode({
          ...postcode,
          validate: true,
          errorMsg: '',
        });
      }
    } else {
      setPostcode({
        ...postcode,
        validate: false,
        errorMsg:
          'Sorry we did not recognise that postcode, check and try again.',
      });
    }
  };

  return (
    <StyledModal show={isShow} onHide={hideModal} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            fontSize: curPage === POSTCODE_STORE_OPENED ? '32px' : '34px',
          }}
        >
          {curPage === POSTCODE_CONFIRM_VIEW && 'Confirm your Postcode'}
          {curPage === POSTCODE_SORRY_VIEW && "We're really sorry"}
          {curPage === POSTCODE_STORE_OPENED &&
            `The store is Opening ${
              checkDayStoreStatus(storeInfo, new Date()).openTime
            }`}
          {curPage === POSTCODE_STORE_CLOSED && 'Sorry this store is closed'}
        </Modal.Title>
      </Modal.Header>
      {curPage === POSTCODE_CONFIRM_VIEW && (
        <Modal.Body className="confirm-view">
          <h5>We need to confirm if this store can deliver</h5>
          <Form.Group className="postcode-form">
            <Form.Control
              type="text"
              className="ht-form-control"
              value={postcode.value}
              onChange={(e) => {
                setPostcode({
                  ...postcode,
                  value: e.target.value,
                });
              }}
              isInvalid={!postcode.validate}
              placeholder="Enter your postcode"
            />
            <Form.Control.Feedback type="invalid">
              {postcode.errorMsg}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
      )}
      {curPage === POSTCODE_SORRY_VIEW && (
        <Modal.Body className="sorry-view">
          <h5>
            We’re sorry but this store does not deliver to your <br />
            area, however, we can still help
          </h5>
          <Button
            variant="primary"
            onClick={() => {
              history.push({
                pathname: '/store/list',
                search: `?postcode=${postcode.value}`,
              });
            }}
            className="btn-origin ht-btn-primary"
          >
            Search other Places Nearby
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setCurPage(POSTCODE_CONFIRM_VIEW);
            }}
            className="btn-pink ht-btn-primary"
          >
            Enter a new Postcode
          </Button>
        </Modal.Body>
      )}
      {curPage === POSTCODE_STORE_OPENED && (
        <Modal.Body className="open-view">
          <h5>
            Minimum Order £
            {Number(get(storeInfo, 'minimum_delivery_amount', 0)).toFixed(2)}
          </h5>
          <Button
            variant="primary"
            className="btn-origin ht-btn-primary"
            onClick={() => {
              history.push({
                pathname: '/store/list',
                search: `?postcode=${postcode.value}`,
              });
            }}
          >
            Search other Places Nearby
          </Button>
          <Button
            variant="primary"
            className="btn-pink ht-btn-primary"
            onClick={() => {
              setCurPage(POSTCODE_CONFIRM_VIEW);
            }}
          >
            Enter a new Postcode
          </Button>
        </Modal.Body>
      )}
      {curPage === POSTCODE_STORE_CLOSED && (
        <Modal.Body className="closed-view">
          <h5>
            This store is closed today and unfortunately wont be accepting any
            orders
          </h5>
          <Button
            variant="primary"
            className="btn-origin ht-btn-primary"
            onClick={() => {
              history.push({
                pathname: '/store/list',
                search: `?postcode=${postcode.value}`,
              });
            }}
          >
            Search other Places Nearby
          </Button>
        </Modal.Body>
      )}
      <Modal.Footer>
        {curPage === POSTCODE_CONFIRM_VIEW && (
          <Button
            variant="primary"
            className="ht-btn-primary"
            onClick={clickSearch}
          >
            Search
          </Button>
        )}
      </Modal.Footer>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .modal-dialog-centered {
    max-width: 650px;
  }

  .modal-content {
    border-radius: 12px;
    border: none;
  }

  .modal-header {
    height: 99px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    broder-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .modal-title {
      font-size: 34px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: ${PRIMARY_DARK_COLOR};
    }

    .close {
      position: absolute;
      right: 15px;
      top: 15px;
      color: #0b0c0c;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      border: solid 1px rgba(39, 40, 72, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
  }

  .modal-body {
    padding: 20px;
    height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;

    h5 {
      font-size: 18px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: ${PRIMARY_DARK_COLOR};
      margin: 18px 0 0 0;
      text-align: center;
      max-width: 500px;
    }

    .btn-origin {
      font-size: 15px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
    }

    .btn-pink {
      font-size: 15px;
      background-color: #bb6bd9;
      border: solid 1.5px rgba(0, 0, 0, 0.1);
      margin: 24px 0 0 0;
      height: 50px;
      padding: 0;
      justify-content: center;
      align-items: center;
    }

    &.confirm-view {
      .postcode-form {
        margin-top: 36px;
        width: 100%;
        max-width: 510px;

        input[type='text'] {
          font-size: 18px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #66657e;
          text-align: center;
        }

        .invalid-feedback {
          text-align: center;
        }
      }
    }

    &.sorry-view {
      .btn-origin {
        width: 282px;
        margin: 24px 0 0 0;
      }

      .btn-pink {
        width: 238px;
        margin: 24px 0 0 0;
      }
    }

    &.open-view {
      .btn-origin {
        width: 282px;
        margin: 24px 0 0 0;
      }

      .btn-pink {
        width: 238px;
        margin: 24px 0 0 0;
      }
    }

    &.closed-view {
      .btn-origin {
        width: 282px;
        margin: 35px 0 0 0;
      }
    }
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: #fafbff;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    .ht-btn-primary {
      width: 165px;
    }
  }
`;

export default ConfirmPostcodeModal;
