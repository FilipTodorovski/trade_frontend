import React from 'react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragFocusItem from '../../../../components/DragFocusItem';
import * as CONSTANTS from 'constants/constants';
import ItemDragable from './ItemDragable';

const CategoryDragable = ({ history, selectedMenu, updateCategory }) => {
  const onCategoryDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = CONSTANTS.reorder(
      selectedMenu.categories,
      result.source.index,
      result.destination.index
    );

    updateCategory([
      ...items.map((item, nIndex) => {
        return { ...item, order: nIndex };
      }),
    ]);
  };

  const handleClickCollapse = (id) => {
    updateCategory(
      selectedMenu.categories.map((item) => {
        if (item.id === id) item.collapsed = !item.collapsed;
        return item;
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onCategoryDragEnd}>
      <Droppable droppableId="category-droppable">
        {(provided, snapshot) => (
          <CategoryContainer ref={provided.innerRef}>
            {_.get(selectedMenu, 'categories', [])
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`item-${item.id}`}
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
                          onClick={() =>
                            history.push(`/menus/category/${item.id}`)
                          }
                          role="button"
                        >
                          {item.category.name}
                        </div>
                        <div className="item">{`Items: ${item.category.item.length}`}</div>
                        <div
                          className="btn-expand"
                          onClick={() => {
                            handleClickCollapse(item.id);
                          }}
                          role="button"
                        >
                          {item.collapsed ? '+' : '-'}
                        </div>
                      </DragableItem>
                      <div className="expand-div">
                        <ItemDragable
                          dragableId={`itemDragable-${item.id}-index`}
                          itemList={item.category.item}
                          updateItem={(updatedOne) => {
                            updateCategory([
                              ...selectedMenu.categories.map((itemCategory) => {
                                if (itemCategory.id === item.id)
                                  return {
                                    ...itemCategory,
                                    category: {
                                      ...itemCategory.category,
                                      item: [...updatedOne],
                                    },
                                  };
                                return itemCategory;
                              }),
                            ]);
                          }}
                        />
                      </div>
                    </DragableItemContainer>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </CategoryContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const CategoryContainer = styled.div`
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
    cursor: pointer;
  }

  .item {
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

export default withRouter(CategoryDragable);
