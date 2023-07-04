import React from 'react';

import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import HtSpinner from '../../components/HtSpinner';

import TopMenuSvg from 'assets/images/top-menu.svg';

const TopMenuItems = ({ orderList, loading }) => {
  const renderMenuList = () => {
    let productItemList = [];

    orderList.forEach((item) => {
      item.items.forEach((itemOne) => {
        const findProduct = productItemList.filter(
          (itemProduct) => itemProduct.product_id === itemOne.product_id
        );
        if (findProduct && findProduct.length > 0)
          productItemList = [
            ...productItemList.map((itemProduct) => {
              if (itemProduct.product_id === itemOne.product_id)
                return {
                  ...itemProduct,
                  count: itemProduct.count + itemOne.qty,
                };
              return itemProduct;
            }),
          ];
        else
          productItemList.push({
            ...itemOne,
            count: itemOne.qty,
          });
      });
    });

    const renders = productItemList
      .sort((a, b) => b.count - a.count)
      .map((item, nIndex) => {
        if (nIndex >= 10) return null;
        return (
          <ItemDiv key={nIndex}>
            {item.name}
            <span>{item.count}</span>
          </ItemDiv>
        );
      });
    return renders;
  };

  return (
    <ComponentCard>
      <CardHeader>
        <img src={TopMenuSvg} alt="TopMenu" />
        Top Selling Items
      </CardHeader>
      {orderList.length === 0 && (
        <p className="empty-content">
          No relevant data for selected time period
        </p>
      )}
      {loading && <HtSpinner />}
      {renderMenuList()}
    </ComponentCard>
  );
};

const ComponentCard = styled(Card)`
  flex: 1 1 100%;
  margin-right: 22.5px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 12px;
  min-height: 295px;

  .empty-content {
    text-align: center;
    margin-top: 90px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  height: 82px;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  padding: 0 47px;
  border-bottom: 1px solid rgba(39, 40, 72, 0.2);
  img {
    margin-right: 15px;
  }
`;

const ItemDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  border-bottom: 1px solid rgba(39, 40, 72, 0.2);
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  padding: 0 116px 0 68px;
  &:last-child {
    border-bottom: none;
  }
`;

export default TopMenuItems;
