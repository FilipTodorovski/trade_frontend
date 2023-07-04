import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import {
  createCategoryAction,
  updateCategoryAction,
} from '../../../actions/categoryAction';
import * as CONSTANTS from '../../../constants';

const AddCategoryModal = ({
  isShow,
  hideModal,
  menuId,
  modalInfo,
  createCategoryAction,
  updateCategoryAction,
}) => {
  const [categoryInfo, setCategoryInfo] = useState({ ...modalInfo });

  useEffect(() => {
    setCategoryInfo({ ...modalInfo });
  }, [modalInfo]);

  const addCategory = (e) => {
    if (e.currentTarget.checkValidity()) {
      if (categoryInfo.id === -1) {
        axios
          .post(
            '/category',
            {
              name: categoryInfo.name,
              description: categoryInfo.description,
              menu_id: menuId,
            },
            CONSTANTS.getToken()
          )
          .then((res) => {
            createCategoryAction(res.data.category);
            hideModal();
          })
          .catch((err) => {
            hideModal();
          });
      } else {
        axios
          .put(
            `/category/${categoryInfo.id}`,
            { ...categoryInfo },
            CONSTANTS.getToken()
          )
          .then((res) => {
            updateCategoryAction(res.data.category);
            hideModal();
          })
          .catch((err) => {
            hideModal();
          });
      }
    }
    e.preventDefault();
  };

  return (
    <Modal
      size="md"
      show={isShow}
      onHide={() => {
        hideModal();
      }}
      centered
    >
      <Modal.Header className="border-0">
        <Modal.Title>Add a category</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <Form onSubmit={addCategory}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="eg Pizas"
              type="text"
              value={categoryInfo.name}
              onChange={(e) => {
                setCategoryInfo({
                  ...categoryInfo,
                  name: e.target.value,
                });
              }}
              required
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="textarea"
              className="resize-none"
              value={categoryInfo.description}
              onChange={(e) => {
                setCategoryInfo({
                  ...categoryInfo,
                  description: e.target.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="d-flex">
            <Button
              variant="outline-secondary"
              className="ml-auto"
              onClick={(e) => {
                e.preventDefault();
                hideModal();
              }}
            >
              Close
            </Button>
            <Button className="ml-2" type="submit">
              {categoryInfo.id === -1 ? 'Create Category' : 'Update Category'}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default connect(null, {
  createCategoryAction,
  updateCategoryAction,
})(AddCategoryModal);
