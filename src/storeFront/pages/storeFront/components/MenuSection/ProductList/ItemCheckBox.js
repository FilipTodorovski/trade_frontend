import React from 'react';
import styled from 'styled-components';
import { Form, Button } from 'react-bootstrap';
import CheckBox from 'sharedComponents/CheckBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import { PRIMARY_ACTIVE_COLOR } from 'constants/constants';

const ItemCheckBox = ({
  name,
  checked,
  onChange,
  price,
  qty,
  changeQty,
  showItemCount,
}) => {
  const handleClickQty = (addValue) => {
    changeQty(qty + addValue);
  };

  return (
    <ComponentContainer className="mb-2">
      <CheckBox
        name={name}
        checked={checked}
        onChange={() => onChange(!checked)}
      />
      {checked && showItemCount && (
        <CountContainer>
          <Button
            className="ht-btn-outline-primary"
            variant="outline"
            disabled={qty <= 1 ? true : false}
            onClick={() => {
              handleClickQty(-1);
            }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
          <Form.Label>{qty}</Form.Label>
          <Button
            className="ht-btn-outline-primary"
            variant="outline"
            onClick={() => {
              handleClickQty(1);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </CountContainer>
      )}
      <Form.Label
        className="price-label"
        style={{ marginLeft: checked && showItemCount ? '0' : 'auto' }}
      >
        (+£{Number(price).toFixed(2)})
      </Form.Label>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  .form-group {
    margin: 0;
  }
  .price-label {
    margin: 0 0 0 auto;
    width: 70px;
    cursor: pointer;
    text-align: right;
  }
  .form-label {
    white-space: nowrap;
    margin-bottom: 0;
    line-height: 24px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      border: 1px solid ${PRIMARY_ACTIVE_COLOR};
    }
    .svg-inline--fa {
      font-size: 13px;
    }
  }
  .form-label {
    width: 30px;
    text-align: center;
    margin: 0;
    padding: 0;
  }
`;

export default ItemCheckBox;
