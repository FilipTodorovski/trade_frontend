import React from 'react';
import styled from 'styled-components';
import { Form, Button, InputGroup } from 'react-bootstrap';
import _ from 'lodash';

import ItemDragable from './ItemDragable';
import * as CONSTANTS from 'constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const GroupOptionDetail = ({
  group,
  setGroup,
  groupValidate,
  newItems,
  setNewItems,
  updatedItems,
  setUpdatedItems,
  removedItemIds,
  setRemovedItemIds,
}) => {
  const handleDeleteNewItem = (index) => {
    const list = newItems;
    if (list.length > 0) {
      setNewItems(list.filter((item, i) => i !== index));
    }
  };

  const onAddNewItem = () => {
    setNewItems([
      ...newItems,
      {
        name: '',
        base_price: '',
        order: group.items.length + newItems.length,
      },
    ]);
  };

  return (
    <GroupDetailContainer className="ht-card">
      <h5>Variation details</h5>
      <Form>
        <Form.Group>
          <Form.Label className="ht-label">Variation name</Form.Label>
          <Form.Control
            className="ht-form-control name-input"
            type="input"
            value={group.name}
            onChange={(e) => {
              setGroup({
                ...group,
                name: e.target.value,
              });
            }}
            placeholder="Enter variation name"
            isInvalid={!groupValidate.name.validate}
          />
          <Form.Control.Feedback type="invalid">
            {groupValidate.name.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="item-select-group">
          <Form.Label className="ht-label">
            Add new items to this variation
          </Form.Label>
          <div className="d-flex flex-column justify-content-center">
            {newItems.map((item, index) => (
              <div
                key={index}
                className="d-flex new-item my-2 justify-content-between align-items-center"
              >
                <Form.Control
                  className="ht-form-control name-input"
                  type="input"
                  onChange={(e) => {
                    item.name = e.target.value;
                  }}
                  placeholder="Enter product name"
                />
                <InputGroup className="input-group">
                  <InputGroup.Prepend>
                    <InputGroup.Text>£</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    className="ht-form-control text-right"
                    placeholder="10"
                    onChange={(e) => {
                      item.base_price = Number(e.target.value);
                    }}
                    onBlur={(e) => {
                      item.base_price = Number(e.target.value);
                    }}
                  />
                </InputGroup>
                <DeleteButton onClick={() => handleDeleteNewItem(index)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </DeleteButton>
              </div>
            ))}
            <a href className="text-center my-2" onClick={onAddNewItem}>
              Add an item
            </a>
          </div>
          {!groupValidate.items.validate && (
            <CustomInvalidLabel>
              {groupValidate.items.errorMsg}
            </CustomInvalidLabel>
          )}
        </Form.Group>
        <ItemDragable
          group={group}
          setGroup={setGroup}
          removedItemIds={removedItemIds}
          setRemovedItemIds={setRemovedItemIds}
          updatedItems={updatedItems}
          setUpdatedItems={setUpdatedItems}
        />
      </Form>
    </GroupDetailContainer>
  );
};

const GroupDetailContainer = styled.div`
  margin-top: 50px;
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

  form {
    margin-top: 30px;

    .form-group {
      margin-bottom: 25px;
      width: 100%;
      max-width: 407px;

      &.item-select-group {
        max-width: 100%;
        .item-selector {
          flex: 1 1 407px;
        }
        .ht-btn-primary {
          flex: 1 0 110px;
          margin-left: 15px;
          padding-left: 0;
          padding-right: 0;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      .input-group {
        margin-left: auto;
        width: 180px;
        input {
          height: 40px;
        }
      }

      .input-group-prepend {
        .input-group-text {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
      }
      .input-group-append {
        .input-group-text {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
      }

      .new-item {
        gap: 20px;
      }
    }
  }
`;

const CustomInvalidLabel = styled.div`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 100%;
  color: #d4351c;

  &.invalidate {
    .select__control {
      border: solid 1.5px #d4351c !important;
    }
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
  }
`;

const DeleteButton = styled(Button)`
  color: ${CONSTANTS.SECOND_GREY_COLOR};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: solid 1.5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-left: auto;
  &.disabled {
    pointer-events: none !important;
    opacity: 0.7 !important;
    background-color: white !important;
    border: solid 1.5px rgba(0, 0, 0, 0.1) !important;
    color: ${CONSTANTS.SECOND_GREY_COLOR} !important;
  }
`;

export default GroupOptionDetail;
