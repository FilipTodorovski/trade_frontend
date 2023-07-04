import React from 'react';
import styled from 'styled-components';
import { Form, Button } from 'react-bootstrap';
import { PRIMARY_ACTIVE_COLOR, PRIMARY_DARK_COLOR } from 'constants/constants';

const ItemRadioBox = ({ id, name, checked, onChange, price }) => {
  return (
    <ComponentContainer className="mb-2">
      <label className="delivery-option">
        <input
          id={id}
          type="radio"
          name={id}
          checked={checked}
          onChange={onChange}
        />
        <span className="checkmark"></span>
        <label className="name" htmlFor={id}>
          {name}
        </label>
      </label>
      {/* {checked && (
          <CountContainer>
            <Button
              className="ht-btn-outline-primary"
              variant="outline"
              disabled={true}
            >
              -
            </Button>
            <Form.Label>{1}</Form.Label>
            <Button
              className="ht-btn-outline-primary"
              variant="outline"
              disabled={true}
            >
              +
            </Button>
          </CountContainer>
        )} */}

      <Form.Label
        className="price-label"
        style={{ marginLeft: 'auto' }}
        // style={{ marginLeft: checked ? '0' : 'auto' }}
      >
        (+£{price})
      </Form.Label>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 2px;
  .delivery-option {
    display: flex;
    flex: 1 1 100%;
    width: 100%;
    align-items: center;
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin: 0;
    position: absolute;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    input:checked ~ .checkmark {
      background-color: ${PRIMARY_ACTIVE_COLOR};
    }

    input:checked ~ .checkmark:after {
      display: flex;
    }

    .name {
      cursor: pointer;
      height: 20px;
      margin: 0 0 0 9px;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 18px;
      width: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(0, 0, 0, 0.2);

      &:after {
        content: '';
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        display: none;
        background: white;
        width: 9px;
        height: 9px;
        border-radius: 5px;
      }
    }
  }

  .price-label {
    text-align: right;
    width: 70px;
    margin: 0;
  }
`;

const CountContainer = styled.div`
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 auto;
  height: 20px;

  .btn {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    font-size: 24px;
    padding: 0;
    margin: 0;
    font-weight: 300;
    line-height: 16px;
    border: 1px solid #c7c7c7;
    cursor: pointer;
    &:hover {
      border: 1px solid ${PRIMARY_ACTIVE_COLOR};
    }
  }
  .form-label {
    width: 30px;
    text-align: center;
    margin: 0;
    padding: 0;
  }
`;

export default ItemRadioBox;
