import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import FileUpload from '../../../../components/FileUpload';
import * as CONSTANTS from '../../../../constants';
import Switch from '../../../../../sharedComponents/SwitchButton';

const AddProductModal = ({
  isShow,
  modalInfo,
  hideModal,
  categoryInfo,
  updateProductList,
}) => {
  const [productInfo, setProductInfo] = useState({ ...modalInfo });

  const [imgFile, setImgFile] = useState(null);

  const onSubmit = (e) => {
    if (e.currentTarget.checkValidity()) {
      if (productInfo.id === -1) {
        const tempOne = { ...productInfo };
        delete tempOne.id;
        const formData = new FormData();
        Object.keys(tempOne).forEach((item) => {
          formData.append(item, productInfo[item]);
        });
        formData.append('menu_id', categoryInfo.menu_id);
        if (imgFile) formData.append('product_img', imgFile);

        axios({
          method: 'post',
          url: '/product',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...CONSTANTS.getToken().headers,
          },
        })
          .then((res) => {
            updateProductList(true, res.data.product);
            hideModal();
          })
          .catch((err) => {
            console.log('Error occured when create product');
          });
      } else {
        const infoTemp = { ...productInfo };
        delete infoTemp.id;

        const formData = new FormData();
        Object.keys(infoTemp).forEach((item) => {
          formData.append(item, infoTemp[item]);
        });

        if (imgFile) formData.append('product_img', imgFile);

        axios({
          method: 'put',
          url: `/product/${productInfo.id}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...CONSTANTS.getToken().headers,
          },
        })
          .then((res) => {
            updateProductList(false, res.data.product);
            hideModal();
          })
          .catch((err) => {
            console.log('Error Occured when update product');
          });
      }
    }
    e.preventDefault();
  };

  return (
    <Modal
      show={isShow}
      onHide={() => {
        hideModal();
      }}
      centered
      size="md"
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title>
          {productInfo.id === -1 ? 'Add a Product' : 'Edit Product'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Row>
            <Form.Group as={Col} lg="12">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={productInfo.name}
                placeholder="eg Four Seasons Pizza"
                onChange={(e) => {
                  setProductInfo({ ...productInfo, name: e.target.value });
                }}
                required
              />
            </Form.Group>
            <Form.Group as={Col} lg="12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                className="resize-none"
                value={productInfo.description}
                onChange={(e) => {
                  setProductInfo({
                    ...productInfo,
                    description: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group as={Col} lg="12">
              <Form.Label>Price</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="add-product-price">£</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  aria-describedby="add-product-price"
                  value={productInfo.price}
                  onChange={(e) =>
                    setProductInfo({ ...productInfo, price: e.target.value })
                  }
                  onBlur={(e) => {
                    setProductInfo({
                      ...productInfo,
                      price: parseFloat(e.target.value).toFixed(2),
                    });
                  }}
                />
                <InputGroup.Append>
                  <InputGroup.Text>GBP</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
            {productInfo.id !== -1 && (
              <Form.Group as={Col} lg="12">
                <Form.Label>Track Inventory&nbsp;&nbsp;&nbsp;</Form.Label>
                <Switch
                  inputId={`Edit${productInfo.name}${productInfo.id}`}
                  isOn={productInfo.track_inventory}
                  handleToggle={() =>
                    setProductInfo({
                      ...productInfo,
                      track_inventory: !productInfo.track_inventory,
                    })
                  }
                />
              </Form.Group>
            )}
            <FileUpload
              isOptional
              imgSrc={productInfo.product_img}
              setImgSrc={(img) =>
                setProductInfo({ ...productInfo, product_img: img })
              }
              setImgFile={(file) => setImgFile(file)}
            />
            <Form.Group as={Col} lg="12" className="d-flex">
              <Button
                variant="outline-secondary"
                className="ml-auto"
                onClick={hideModal}
              >
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                {modalInfo.id === -1 ? 'Create Product' : 'Save Product'}
              </Button>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
