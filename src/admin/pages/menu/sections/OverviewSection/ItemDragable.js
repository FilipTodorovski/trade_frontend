import React from 'react';
import { withRouter } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragFocusItem from '../../../../components/DragFocusItem';
import * as CONSTANTS from 'constants/constants';
import GroupDragable from './GroupDragable';

const ItemDragable = ({ history, dragableId, itemList, updateItem }) => {
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return;

    const items = CONSTANTS.reorder(
      itemList,
      result.source.index,
      result.destination.index
    );

    updateItem([
      ...items.map((item, nIndex) => {
        return { ...item, order: nIndex };
      }),
    ]);
  };

  const handleClickCollapse = (itemId) => {
    updateItem([
      ...itemList.map((item) => {
        if (itemId === item.id) return { ...item, collapsed: !item.collapsed };
        return item;
      }),
    ]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`${dragableId}item`}>
        {(provided) => (
          <ItemContainer ref={provided.innerRef}>
            {itemList
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`item-${item.id}`}
                  index={index}
                >
                  {(provided) => (
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
                          onClick={() => history.push(`/menus/item/${item.id}`)}
                        >
                          {item.name}
                        </div>
                        <div className="price">
                          £{Number(item.base_price).toFixed(2)}
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
                          <GroupDragable
                            dragableId={`${dragableId}-${item.id}-${index}-group`}
                            groupList={item.groups_info}
                            updateGroups={(updatedGroup) => {
                              updateItem([
                                ...itemList.map((itemOne) => {
                                  if (itemOne.id === item.id)
                                    return {
                                      ...itemOne,
                                      groups_info: updatedGroup,
                                    };
                                  return itemOne;
                                }),
                              ]);
                            }}
                          />
                        </div>
                      )}
                    </DragableItemContainer>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </ItemContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const ItemContainer = styled.div`
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

  .price {
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

export default withRouter(ItemDragable);
