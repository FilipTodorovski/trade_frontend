import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import get from 'lodash/get';
import styled from 'styled-components';
import { getStoreCloudImg } from 'utils/cloudImg';
import AddProductModal from './AddProductModal';
import PreloadSVG from 'svg/placeholder.svg';

const ProductList = ({ categoryInfo }) => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const sortedItem = categoryInfo.items.sort((a, b) => a.order - b.order);
  if (sortedItem.length === 0) return null;
  return (
    <div
      className="product-list d-flex flex-column mt-3"
      category-id={categoryInfo.id}
    >
      <h3 className="mb-4 category-name">{get(categoryInfo, 'name', '')}</h3>
      <div className="product-list-container">
        {sortedItem.map((item) => {
          return (
            <ProductCard
              className="product-card"
              onClick={() => {
                setSelectedItem(item.id);
                setShowAddProductModal(true);
              }}
              key={item.id}
              disabled={!item.active}
            >
              <Card.Body className="d-flex">
                <div className="infos">
                  <h6 className="product-name">{get(item, 'name', '')}</h6>
                  {/* <div>
                    <p className="description mb-2">
                      {get(item, 'description', '')}
                    </p>
                  </div> */}
                  <div className="d-flex align-items-center mt-3">
                    <span className="price">
                      £{Number(get(item, 'base_price', '')).toFixed(2)}
                    </span>
                    {/* <span className="text-warning ml-2">
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      Popular
                    </span> */}
                  </div>
                </div>
                {get(item, 'photo_img', '').length > 0 && (
                  <div
                    className="product-img"
                    style={{
                      backgroundImage: `url(${getStoreCloudImg(
                        get(item, 'photo_img', ''),
                        'product',
                        96,
                        96,
                        ''
                      )}`,
                    }}
                  >
                    {get(item, 'photo_img', '') === '' && (
                      <img src={PreloadSVG} alt="preload" />
                    )}
                  </div>
                )}
              </Card.Body>
            </ProductCard>
          );
        })}
      </div>
      {showAddProductModal && (
        <AddProductModal
          isShow={showAddProductModal}
          hideModal={() => setShowAddProductModal(false)}
          productInfo={
            categoryInfo.items.filter((item) => item.id === selectedItem)[0]
          }
        />
      )}
    </div>
  );
};

const ProductCard = styled(Card)`
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  cursor: ${(props) => (props.disabled ? 'none' : 'pointer')};
`;

export default ProductList;
