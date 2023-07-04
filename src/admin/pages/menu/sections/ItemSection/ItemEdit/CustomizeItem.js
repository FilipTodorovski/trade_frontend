import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';
import * as CONSTANTS from 'constants/constants';
import GroupDragable from './GroupDragable';

const CustomizeItem = ({ item, setItem, groupList }) => {
  const [selectedGroup, setSelectedGroup] = useState({});

  useEffect(() => {
    if (!item.sell_its_own) setSelectedGroup({});
  }, [item.sell_its_own]);

  const addGroup = () => {
    if (Object.keys(selectedGroup).length === 0) return;
    setItem({
      ...item,
      groups_info: [
        ...item.groups_info,
        {
          ...selectedGroup,
          id: selectedGroup.value,
          order: item.groups_info.length,
          collapsed: true,
        },
      ],
    });
    setSelectedGroup({});
  };

  const getGroupSaveBtnStatus = () => {
    if (!item.sell_its_own) return false;
    if (Object.keys(selectedGroup).length === 0) return false;

    if (item.groups_info && item.groups_info.length > 0) {
      const groupIds = item.groups_info.map((groupOne) => groupOne.id);
      if (groupIds.indexOf(selectedGroup.id) >= 0) return false;
      return true;
    }
    return true;
  };

  return (
    <CustomizedItemContainer className="ht-card">
      <h5 className="title">Item Variations</h5>
      <Form.Group className="group-select-div">
        <Form.Label className="ht-label">
          Variations allow customers to select different sizes etc
        </Form.Label>
        <div className="content">
          <Select
            name="group-selector"
            options={groupList}
            className="ht-selector group-selector"
            classNamePrefix="select"
            placeholder="Add options groups"
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e);
            }}
            isDisabled={!item.sell_its_own}
            noOptionsMessage={() =>
              'There is no group can be added to this item.'
            }
          />
          <Button
            variant="primary"
            className={`ht-btn-primary ${
              getGroupSaveBtnStatus() ? '' : 'ht-btn-primary-disable'
            }`}
            onClick={addGroup}
          >
            Add
          </Button>
        </div>
      </Form.Group>
      {item.groups_info.length > 0 && (
        <GroupDragable item={item} setItem={setItem} />
      )}
    </CustomizedItemContainer>
  );
};

const CustomizedItemContainer = styled.div`
  margin: 60px 0;
  padding: 40px 40px 50px 40px;
  .title {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0 0 30px 0;
  }

  .group-select-div {
    display: flex;
    flex-direction: column;
    .content {
      display: flex;
      width: 100%;
      max-width: 530px;
    }
    .ht-selector {
      flex: 1 1 100%;
    }
    .ht-btn-primary {
      flex: 1 0 100px;
      margin-left: 15px;
    }
  }
`;

export default CustomizeItem;
