import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import get from 'lodash/get';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import GroupList from './GroupList';
import CustomOutlinedButton from 'sharedComponents/CustomOutlinedButton';
import { getStoreCloudImg } from 'utils/cloudImg';
import { getOrderedProductPrice } from 'utils/order';
import { ADD_PRODUCT_TO_CART } from '../../../../../actions/actionTypes';
import uuid from 'react-uuid';

const AddProductModal = ({ isShow, productInfo, hideModal }) => {
  const dispatch = useDispatch();

  const groupRefs = useRef([]);

  const [productOrder, setProductOrder] = useState({
    id: uuid(),
    product_id: productInfo.id,
    qty: 1,
    price: productInfo.base_price,
    name: productInfo.name,
    groups: [],
  });

  useEffect(() => {
    setProductOrder({
      id: uuid(),
      product_id: productInfo.id,
      qty: 1,
      price: productInfo.base_price,
      name: productInfo.name,
      groups: [],
    });
    groupRefs.current = new Array(productInfo.groups_info.length);
  }, [productInfo]);

  const changeProductCount = (nValue) => {
    setProductOrder({
      ...productOrder,
      qty: productOrder.qty + nValue < 1 ? 1 : productOrder.qty + nValue,
    });
  };

  const updateOrderGroups = useCallback(
    (groupOrder) => {
      if (!groupOrder.items || groupOrder.items.length === 0)
        //if groups has no selected items
        setProductOrder({
          ...productOrder,
          groups: [
            ...productOrder.groups.filter((item) => item.id !== groupOrder.id),
          ],
        });
      else {
        // group has selected items
        const findGroup = productOrder.groups.find(
          (item) => item.id === groupOrder.id
        );
        if (findGroup) {
          // group is new added
          setProductOrder({
            ...productOrder,
            groups: [
              ...productOrder.groups.map((item) => {
                if (item.id === findGroup.id) return groupOrder;
                else return item;
              }),
            ],
          });
        } else {
          // group already exsit
          setProductOrder({
            ...productOrder,
            groups: [...productOrder.groups, groupOrder],
          });
        }
      }
    },
    [productOrder]
  );

  const handleClickAdd = () => {
    let validate = true;
    groupRefs.current.forEach((item) => {
      const groupValidate = item.checkValidate();
      if (!groupValidate) validate = groupValidate;
    });
    if (!validate) return;

    dispatch({
      type: ADD_PRODUCT_TO_CART,
      payload: productOrder,
    });
    hideModal();
  };

  return (
    <Modal
      show={isShow}
      onHide={() => {
        hideModal();
      }}
      size="lg"
      backdrop="static"
      centered
      className="add-product-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {get(productInfo, 'name', '')}
          <br />{' '}
          <DescriptionText>
            {get(productInfo, 'description', '')}
          </DescriptionText>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        {get(productInfo, 'photo_img', '') !== '' && (
          <ProductImg
            backgroundImage={getStoreCloudImg(
              get(productInfo, 'photo_img', ''),
              'product',
              209,
              110,
              ''
            )}
          />
        )}

        {productInfo.groups_info
          .sort((a, b) => a.order - b.order)
          .map((groupOne, idx) => {
            return (
              <GroupList
                key={groupOne.id}
                groupInfo={groupOne}
                orderedGroupInfo={productOrder.groups.find(
                  (item) => item.id === groupOne.id
                )}
                updateGroupOrder={updateOrderGroups}
                ref={(el) => (groupRefs.current[idx] = el)}
              />
            );
          })}
        <div className="d-flex justify-content-center align-items-center mt-5">
          <CustomOutlinedButton onClick={() => changeProductCount(-1)}>
            -
          </CustomOutlinedButton>
          <h3 className="m-0 ml-4 mr-4">{productOrder.qty}</h3>
          <CustomOutlinedButton onClick={() => changeProductCount(1)}>
            +
          </CustomOutlinedButton>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CancelButton
          variant="outline-primary"
          className="btn-cancel ht-btn-outline-primary mr-1"
          onClick={() => hideModal()}
        >
          Cancel
        </CancelButton>
        <AddButton
          className="ht-btn-primary ml-1"
          onClick={() => {
            handleClickAdd();
          }}
        >
          Add for £{Number(getOrderedProductPrice(productOrder)).toFixed(2)}
        </AddButton>
      </Modal.Footer>
    </Modal>
  );
};

const ProductImg = styled.div`
  width: 209px;
  height: 110px;
  background-position: center;
  background-color: #e8ebeb;
  background-size: cover;
  background-image: ${(props) => `url(${props.backgroundImage})`};
`;

const AddButton = styled(Button)`
  width: 200px;
  padding: 16px;
`;

const CancelButton = styled(Button)`
  padding: 16px;
  width: 200px;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;

const DescriptionText = styled.span`
  font-size: 14px;
  line-height: 1, 5;
  font-weight: 400;
  display: block;
  margin-top: 20px;
`;
export default memo(AddProductModal);
