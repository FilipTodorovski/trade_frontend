import React from 'react';
import { withRouter } from 'react-router-dom';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragFocusItem from '../../../../components/DragFocusItem';
import * as CONSTANTS from 'constants/constants';

const GroupDragable = ({ history, dragableId, groupList, updateGroups }) => {
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
    }
    const items = CONSTANTS.reorder(
      groupList,
      result.source.index,
      result.destination.index
    );

    updateGroups([
      ...items.map((item, nIndex) => {
        return { ...item, order: nIndex };
      }),
    ]);
  };

  const handleClickCollapse = (itemId) => {
    updateGroups([
      ...groupList.map((item) => {
        if (itemId === item.id) return { ...item, collapsed: !item.collapsed };
        return item;
      }),
    ]);
  };

  const getItemList = (groupId) => {
    const filteredOne = groupList.filter((item) => item.id === groupId);
    if (filteredOne.length === 0) return [];

    const returnList = [];
    filteredOne[0].group.items_info.forEach((item) => {
      const filteredItem = filteredOne[0].group.item.filter(
        (itemOne) => itemOne.id === item.id
      );
      if (filteredItem.length > 0) {
        returnList.push({
          ...item,
          item: filteredItem[0],
        });
      }
    });

    return returnList.sort((a, b) => a.order - b.order);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={dragableId}>
        {(provided, snapshot) => (
          <GroupContainer ref={provided.innerRef}>
            {groupList
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`groups-${item.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <DragableItemContainer
                      className={item.collapsed ? 'collapsed' : 'expanded'}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <DragableItem>
                        <div {...provided.dragHandleProps}>
                          <DragFocusItem />
                        </div>
                        <div
                          className="name"
                          role="button"
                          onClick={() => {
                            history.push(`/menus/group/${item.id}`);
                          }}
                        >
                          {item.group.name}
                        </div>
                        <div className="require-select">
                          {item.group.require_select_item
                            ? 'Customer chooses1'
                            : 'Optional'}
                        </div>
                        <div
                          className="btn-expand"
                          role="button"
                          onClick={() => {
                            handleClickCollapse(item.id);
                          }}
                        >
                          {item.collapsed ? '+' : '-'}
                        </div>
                      </DragableItem>
                      {!item.collapsed && (
                        <div className="expand-div">
                          {getItemList(item.id).map((itemOne) => {
                            return (
                              <DragableItem
                                className="group-item"
                                key={itemOne.id}
                              >
                                <div className="name">{itemOne.item.name}</div>
                                <div className="require-select">
                                  £{itemOne.price}
                                </div>
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
          </GroupContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const GroupContainer = styled.div`
  margin: 20px 42px 0;
  border-radius: 12px;
  background-color: rgba(39, 40, 72, 0.05);
  .category-item {
    margin-bottom: 2px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const DragableItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.expanded {
    .expand-div {
      height: auto;
    }
  }

  &.collapsed {
    .expand-div {
      height: 0;
    }
  }
  .expand-div {
    overflow: hidden;
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
  margin-bottom: 20px;

  &.group-item {
    margin-left: 42px;
    margin-right: 42px;

    .name {
      margin-left: 0;
    }
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
    cursor: pointer;
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

  .btn-expand {
    display: flex;
    cursor: pointer;
    margin-left: 40px;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: rgba(39, 40, 72, 0.1);
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }
`;

export default withRouter(GroupDragable);
