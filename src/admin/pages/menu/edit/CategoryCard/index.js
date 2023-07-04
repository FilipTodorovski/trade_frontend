import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faPencilAlt,
  faTrashAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import ProductListTable from './ProductListTable';
import AddCategoryModal from '../AddCategoryModal';
import AddProductModal from './AddProductModal';

import { deleteCategoryAction } from '../../../../actions/categoryAction';
import * as CONSTANTS from '../../../../constants';

const CategoryCard = ({
  categoryInfo,
  menuId,
  deleteCategoryAction,
  isShowAll,
}) => {
  const [isShow, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddProductModal, setShowAddProductmodal] = useState(false);
  const [selectedProductID, setSelectedProductId] = useState(-1);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    setShow(isShowAll);
  }, [isShowAll]);

  const getSelectedProductInfo = (id) => {
    if (id === -1)
      return {
        id: selectedProductID,
        name: '',
        description: '',
        price: 0,
        product_img: '',
        in_stock: true,
        track_inventory: false,
        category_id: categoryInfo.id,
        order: 0,
      };
    return productList.filter((item) => item.id === id)[0];
  };

  useEffect(() => {
    axios
      .get(`/category/product/${categoryInfo.id}`, CONSTANTS.getToken())
      .then((res) => {
        if (res.data.success) {
          const sortedOne = [
            ...res.data.products.sort((a, b) => a.order - b.order),
          ];
          setProductList([...sortedOne]);
        }
      })
      .catch((err) => {
        console.log('Error occured getting product list');
      });
  }, [categoryInfo.id]);

  const removeCategory = () => {
    axios
      .delete(`/category/${categoryInfo.id}`, CONSTANTS.getToken())
      .then((res) => {
        setShowRemoveModal(false);
        deleteCategoryAction(categoryInfo.id);
      })
      .catch((err) => {
        setShowRemoveModal(false);
      });
  };

  const updateProductList = (isCreate, productOne) => {
    if (isCreate)
      setProductList([
        productOne,
        ...productList.map((item) => {
          return { ...item, order: item.order + 1 };
        }),
      ]);
    else {
      const productListTemp = productList.map((item) => {
        if (item.id === productOne.id) return productOne;
        return item;
      });
      setProductList([...productListTemp]);
    }
  };

  const updateProduct = (productID, key, value) => {
    if (key === 'in_stock') {
      const formData = new FormData();
      formData.append(key, value);

      axios({
        method: 'put',
        url: `/product/${productID}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) updateProductList(false, res.data.product);
        })
        .catch((err) => {
          console.log('Error Occured when update product');
        });
    } else if (key === 'order') {
      axios
        .put('/product/update/order', value, CONSTANTS.getToken())
        .then((res) => {
          if (res.data.success) {
            const productListTemp = productList.map((item) => {
              if (item.id === value[0].id) item.order = value[0].order;
              else if (item.id === value[1].id) item.order = value[1].order;
              return item;
            });
            setProductList([
              ...productListTemp.sort((a, b) => a.order - b.order),
            ]);
          }
        })
        .catch((err) => {
          console.log('Error Occured when update product');
        });
    }
  };

  return (
    <Card className="ht-card category-card">
      <Card.Body>
        <div className="menu-card-header">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              <h5 className="m-0">{categoryInfo.name}</h5>
              <FontAwesomeIcon
                className="ml-2 text-primary cursor-pointer"
                icon={faPencilAlt}
                onClick={() => setShowEditModal(true)}
              />
              <FontAwesomeIcon
                className="ml-2 text-primary cursor-pointer"
                icon={faTrashAlt}
                onClick={() => setShowRemoveModal(true)}
              />
            </div>
            <p className="text-secondary m-0">{categoryInfo.description}</p>
          </div>
          <Button
            className="btn-show"
            variant="outline-secondary"
            onClick={() => setShow(!isShow)}
          >
            {isShow ? 'Hide' : 'Show'}
            <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
          </Button>
        </div>
        <div className={`product-div ${isShow ? '' : 'hide'}`}>
          <ProductListTable
            productList={productList}
            onEditProduct={(selectedId) => {
              setSelectedProductId(selectedId);
              setShowAddProductmodal(true);
            }}
            updateProduct={updateProduct}
          />
        </div>
        <Button
          className="w-100 mt-4"
          variant="outline-secondary"
          onClick={() => {
            setSelectedProductId(-1);
            setShowAddProductmodal(true);
          }}
        >
          Add a product
        </Button>

        <AddCategoryModal
          isShow={showEditModal}
          hideModal={() => setShowEditModal(false)}
          menuId={menuId}
          modalInfo={{
            id: categoryInfo.id,
            name: categoryInfo.name,
            description: categoryInfo.description,
          }}
        />
        {showAddProductModal && (
          <AddProductModal
            isShow={showAddProductModal}
            modalInfo={{
              ...getSelectedProductInfo(selectedProductID),
            }}
            hideModal={() => setShowAddProductmodal(false)}
            categoryInfo={categoryInfo}
            updateProductList={updateProductList}
          />
        )}

        <Modal
          size="sm"
          show={showRemoveModal}
          onHide={() => {
            setShowRemoveModal(false);
          }}
          centered
        >
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-danger mr-1"
              />
              <h5 className="m-0">Delete Category</h5>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                variant="outline-secondary"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                variant="danger"
                onClick={removeCategory}
              >
                Delete Category
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default connect(null, { deleteCategoryAction })(CategoryCard);
