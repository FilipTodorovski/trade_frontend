import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DragFocusItem from '../../../../../components/DragFocusItem';
import * as CONSTANTS from 'constants/constants';

const GroupDragable = ({ item, setItem }) => {
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = CONSTANTS.reorder(
      item.groups_info,
      result.source.index,
      result.destination.index
    );

    setItem({
      ...item,
      groups_info: [
        ...items.map((group, nIndex) => {
          return { ...group, order: nIndex };
        }),
      ],
    });
  };

  const handleClickCollapse = (groupId) => {
    setItem({
      ...item,
      groups_info: [
        ...item.groups_info.map((group) => {
          if (group.id === groupId)
            return { ...group, collapsed: !group.collapsed };
          return { ...group };
        }),
      ],
    });
  };

  const handleDeleteItem = (groupId, itemId) => {
    const groups_info = item.groups_info.map((groupInfo) => {
      if (groupInfo.id === groupId) {
        return {
          ...groupInfo,
          items: groupInfo.items.filter((item) => item.id !== itemId),
        };
      } else {
        return { ...groupInfo };
      }
    });
    setItem({
      ...item,
      groups_info,
    });
  };

  const changePrice = (newPrice, groupId, itemId) => {
    const groups_info = item.groups_info.map((groupInfo) => {
      if (groupInfo.id === groupId) {
        return {
          ...groupInfo,
          items: groupInfo.items.map((item) => {
            return item.id === itemId
              ? { ...item, base_price: parseFloat(newPrice) }
              : item;
          }),
        };
      } else {
        return groupInfo;
      }
    });
    setItem({
      ...item,
      groups_info,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="item-group-dragable">
        {(provided, snapshot) => (
          <DragableContainer ref={provided.innerRef}>
            {item.groups_info
              .sort((a, b) => a.order - b.order)
              .map((group, index) => (
                <Draggable
                  key={group.id}
                  draggableId={`item-${group.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <DragableItemContainer
                      className={group.collapsed ? 'collapsed' : 'expanded'}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <DragableItem>
                        <div {...provided.dragHandleProps}>
                          <DragFocusItem />
                        </div>
                        <div className="name">{group.name}</div>
                        <div className="require-select">
                          {group.require_select_item
                            ? 'Customer chooses1'
                            : 'Optional'}
                        </div>
                        <button
                          className="btn-delete"
                          onClick={() => {
                            setItem({
                              ...item,
                              groups_info: [
                                ...item.groups_info.filter(
                                  (groupInfo) => groupInfo.id !== group.id
                                ),
                              ],
                            });
                          }}
                          type="button"
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ fontSize: '12px' }}
                          />
                        </button>
                        <div
                          className="btn-expand"
                          role="button"
                          onClick={() => handleClickCollapse(group.id)}
                        >
                          {group.collapsed ? '+' : '-'}
                        </div>
                      </DragableItem>
                      {!group.collapsed && (
                        <div className="expand-div">
                          {group.items.map((element) => {
                            return (
                              <DragableItem
                                className="InnerItem"
                                key={element.id}
                              >
                                <div className="name">
                                  {_.get(element, 'name', '')}
                                </div>
                                <InputGroup className="input-group price-input-field">
                                  <InputGroup.Prepend>
                                    <InputGroup.Text>£</InputGroup.Text>
                                  </InputGroup.Prepend>
                                  <Form.Control
                                    type="number"
                                    className="ht-form-control text-right"
                                    placeholder="10"
                                    value={element.base_price}
                                    onChange={(e) =>
                                      changePrice(
                                        e.target.value,
                                        group.id,
                                        element.id
                                      )
                                    }
                                  />
                                </InputGroup>
                                <DeleteButton
                                  onClick={() =>
                                    handleDeleteItem(group.id, element.id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </DeleteButton>
                              </DragableItem>
                            );
                          })}
                        </div>
                      )}
                    </DragableItemContainer>
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
  margin: 20px 0 0;
  border-radius: 12px;
  background-color: rgba(39, 40, 72, 0.05);
  padding: 2px;
`;

const DragableItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0;
  }
  .expand-div {
    padding: 20px 42px 0;
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

  &.InnerItem {
    margin-bottom: 20px;
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
    flex: 1;
  }

  .require-select {
    margin-left: auto;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 17px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }

  .btn-delete {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: solid 1px rgba(39, 40, 72, 0.2);
    outline: none;
    box-shadow: none;
    padding: 0;
    margin-left: 80px;
    background-color: white;
  }

  .btn-expand {
    display: flex;
    cursor: pointer;
    margin-left: 25px;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: rgba(39, 40, 72, 0.1);
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }

  .input-group-text {
    border-radius: 12px;
  }

  .price-input-field {
    width: 150px;
    margin-right: 20px;
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

export default GroupDragable;
