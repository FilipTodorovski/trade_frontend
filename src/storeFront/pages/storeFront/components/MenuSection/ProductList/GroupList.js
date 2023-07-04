import React, { useState, memo, forwardRef, useImperativeHandle } from 'react';
import get from 'lodash/get';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import ItemCheckBox from './ItemCheckBox';
import { PRIMARY_RED_COLOR, PRIMARY_ACTIVE_COLOR } from 'constants/constants';
import uuid from 'react-uuid';

const GroupList = forwardRef(
  ({ groupInfo, orderedGroupInfo, updateGroupOrder }, ref) => {
    const [validateMsg, setValidateMsg] = useState('');

    const getItemStatus = (itemId) => {
      const findOne = get(orderedGroupInfo, 'items', []).find(
        (item) => itemId === item.id
      );
      if (!!findOne) return true;
      return false;
    };

    const getItemQty = (itemId) => {
      const findOne = get(orderedGroupInfo, 'items', []).find(
        (item) => itemId === item.id
      );
      if (!!findOne) return get(findOne, 'qty', 0);
      else return 0;
    };

    useImperativeHandle(ref, () => ({
      checkValidate: () => {
        const totalQty = get(orderedGroupInfo, 'items', []).reduce(
          (a, b) => a + b.qty,
          0
        );

        if (groupInfo.require_select_item && totalQty === 0) {
          setValidateMsg('You should select at least 1 item.');
          return false;

          // eslint-disable-next-line
          if (groupInfo.min_item_count > totalQty) {
            setValidateMsg(
              `You should select at least ${groupInfo.min_item_count} items.`
            );
            return false;
          }

          if (groupInfo.max_item_count < totalQty) {
            setValidateMsg(
              `You should select at most ${groupInfo.max_item_count} items.`
            );
            return false;
          }
        }
        setValidateMsg('');
        return true;
      },
    }));

    const changeItem = (itemId, newValue) => {
      const selectedItem = groupInfo.items.find((item) => item.id === itemId);
      if (!orderedGroupInfo) {
        updateGroupOrder({
          id: groupInfo.id,
          name: groupInfo.name,
          items: [
            {
              id: selectedItem.id,
              name: selectedItem.name,
              order: selectedItem.order,
              price: selectedItem.base_price,
              qty: 1,
            },
          ],
        });
      } else {
        const findOne = get(orderedGroupInfo, 'items', []).find(
          (item) => item.id === itemId
        );
        if (!!findOne) {
          updateGroupOrder({
            ...orderedGroupInfo,
            items: [
              ...orderedGroupInfo.items.filter((item) => item.id !== itemId),
            ],
          });
        } else {
          updateGroupOrder({
            ...orderedGroupInfo,
            items: [
              ...orderedGroupInfo.items,
              {
                id: selectedItem.id,
                name: selectedItem.name,
                order: selectedItem.order,
                price: selectedItem.base_price,
                qty: 1,
              },
            ],
          });
        }
      }
    };

    const changeQty = (itemId, newValue) => {
      updateGroupOrder({
        ...orderedGroupInfo,
        items: [
          ...orderedGroupInfo.items.map((item) => {
            if (item.id === itemId)
              return {
                ...item,
                qty: newValue,
              };
            else return item;
          }),
        ],
      });
    };

    const renderRequiredString = () => {
      if (groupInfo.require_select_item)
        return (
          <Form.Label className="ht-label required-label">Required</Form.Label>
        );
      return null;
    };

    return (
      <GroupContainer key={groupInfo.id} ref={ref}>
        <h5 className="group-title">
          <strong>{groupInfo.name}</strong>
          {renderRequiredString()}
        </h5>
        {groupInfo.items.map((item) => {
          return (
            <ItemCheckBox
              key={`itemcheckbox-${uuid()}`}
              name={item.name}
              price={item.base_price}
              checked={getItemStatus(item.id)}
              onChange={(newValue) => {
                changeItem(item.id, newValue);
              }}
              qty={getItemQty(item.id)}
              changeQty={(newValue) => {
                changeQty(item.id, newValue);
              }}
              showItemCount={groupInfo.max_item_count > 1}
            />
          );
        })}
        {validateMsg.length > 0 && (
          <div className="validation-text">{validateMsg}</div>
        )}
      </GroupContainer>
    );
  }
);

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 35px;
  position: relative;

  .validation-text {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    color: ${PRIMARY_RED_COLOR};
    font-size: 12px;
    line-height: 12px;
  }

  .required-label {
    color: ${PRIMARY_ACTIVE_COLOR};
    margin: 0 0 0 10px;
    font-weight: normal;
    font-size: 12px;
  }
`;

export default memo(GroupList);
