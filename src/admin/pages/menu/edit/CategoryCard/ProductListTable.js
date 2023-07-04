import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from 'react-bootstrap';
import Switch from '../../../../../sharedComponents/SwitchButton';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#f8f9fa',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : '#lightgrey',
  padding: grid,
  width: '100%',
});

const ProductListTable = ({ productList, onEditProduct, updateProduct }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([
      ...productList.map((item) => {
        return { ...item, id: `item-${item.id}`, product_id: item.id };
      }),
    ]);
  }, [productList]);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const itemsReorder = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems([
      ...itemsReorder.map((item, index) => {
        item.order = index;
        return item;
      }),
    ]);

    updateProduct('', 'order', [
      {
        id: items[result.destination.index].product_id,
        order: result.source.index,
      },
      {
        id: items[result.source.index].product_id,
        order: result.destination.index,
      },
    ]);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <table
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <thead>
              <tr style={{ backgroundColor: 'lightgrey' }}>
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">In Stock</th>
                <th className="p-2">Price</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      className="border-bottom"
                    >
                      <td className="px-2 py-1">
                        <div className="d-flex align-items-center">
                          {item.product_img ? (
                            <img
                              src={item.product_img}
                              className="flex-shrink-0 rounded"
                              style={{ width: '40px', height: '40px' }}
                            />
                          ) : (
                            <div
                              className="flex-shrink-0 rounded"
                              style={{
                                backgroundColor: '#6c757d',
                                width: '40px',
                                height: '40px',
                              }}
                            />
                          )}
                          <p className="m-0 ml-2">{item.name}</p>
                        </div>
                      </td>
                      <td className="px-2 py-1 description-td">
                        {item.description}
                      </td>
                      <td className="px-2 py-1">
                        <Switch
                          inputId={item.name + item.product_id}
                          isOn={item.in_stock}
                          handleToggle={() => {
                            updateProduct(
                              item.product_id,
                              'in_stock',
                              !item.in_stock
                            );
                          }}
                        />
                      </td>
                      <td className="px-2 py-1">
                        £{Number(item.price).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        <Button
                          className="text-decoration-none"
                          variant="link"
                          onClick={() => {
                            onEditProduct(item.product_id);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tbody>
          </table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProductListTable;
