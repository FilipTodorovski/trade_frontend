import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { includes, get } from 'lodash';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DragFocusItem from '../../../../../components/DragFocusItem';
import * as CONSTANTS from 'constants/constants';

const ItemDragable = ({
  group,
  setGroup,
  removedItemIds,
  setRemovedItemIds,
  updatedItems,
  setUpdatedItems,
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(group.items);
  }, [group.items]);

  const getItemName = (itemId) => {
    const filteredOne = items.filter((item) => item.id === itemId);
    if (filteredOne.length > 0) return filteredOne[0].name;
    return '';
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = CONSTANTS.reorder(
      group.items,
      result.source.index,
      result.destination.index
    );

    setGroup({
      ...group,
      items,
    });
  };

  const changePrice = async (value, itemId) => {
    const updatedItemIds = updatedItems.map((item) => item.id);
    if (includes(updatedItemIds, itemId)) {
      setUpdatedItems(
        updatedItems.map((i) =>
          i.id === itemId ? { ...i, base_price: value } : i
        )
      );
    } else {
      const find = items.find((i) => i.id === itemId);
      setUpdatedItems([...updatedItems, { ...find, base_price: value }]);
    }

    setItems(
      items.map((i) => (i.id === itemId ? { ...i, base_price: value } : i))
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <DragableContainer ref={provided.innerRef}>
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`item-${item.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <DragableItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div {...provided.dragHandleProps}>
                        <DragFocusItem />
                      </div>
                      <div className="name">{getItemName(item.id)}</div>
                      <InputGroup className="ht-inputgroup">
                        <InputGroup.Prepend>
                          <InputGroup.Text>£</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          className="ht-form-control text-right"
                          type="number"
                          placeholder="0.00"
                          value={parseFloat(item.base_price).toFixed(2)}
                          onChange={(e) => changePrice(e.target.value, item.id)}
                          onBlur={(e) =>
                            changePrice(
                              parseFloat(e.target.value).toFixed(2),
                              item.id
                            )
                          }
                        />
                      </InputGroup>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          setRemovedItemIds([...removedItemIds, item.id]);
                          setItems(items.filter((i) => i.id !== item.id));
                        }}
                        type="button"
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          style={{ fontSize: '12px' }}
                        />
                      </button>
                    </DragableItem>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </DragableContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const DragableContainer = styled.div`
  margin-top: 42px;
  border-radius: 12px;
  background-color: rgba(39, 40, 72, 0.05);
  .category-item {
    margin-bottom: 2px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const DragableItem = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  padding: 15px 40px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0;
  }

  .name {
    margin-left: 27px;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  }

  .input-group {
    margin-left: auto;
    width: 180px;
    input {
      height: 40px;
    }
  }

  .btn-delete {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: solid 1px rgba(39, 40, 72, 0.2);
    outline: none;
    box-shadow: none;
    padding: 0;
    margin-left: 90px;
    background-color: white;
  }
`;
export default ItemDragable;
