import React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import StoreSelector from './StoreSelector';
import * as CONSTANTS from 'constants/constants';

const StoreHeader = ({
  title,
  storeList,
  store,
  selectStore,
  clickSave,
  isChanged,
}) => {
  const getSelectedStoreOption = () => {
    const filteredOne = storeList.filter((item) => item.id === store.id);
    if (filteredOne.length > 0) return filteredOne[0];
    return {};
  };

  const getSaveButtonStr = () => {
    if (store.id === -1) {
      return 'Create new store';
    }
    if (isChanged) return 'Save';
    return 'Saved';
  };

  return (
    <HeaderDiv>
      <h1>{title}</h1>
      {storeList && storeList.length > 0 && (
        <StoreSelector
          selectedOption={getSelectedStoreOption()}
          options={storeList}
          setOption={(selectedOne) => selectStore(selectedOne)}
          availableCreate
        />
      )}
      <SaveButton
        variant="primary"
        className={`${
          isChanged ? '' : 'ht-btn-primary-disable'
        } ht-btn-primary`}
        onClick={clickSave}
      >
        {getSaveButtonStr()}
      </SaveButton>
    </HeaderDiv>
  );
};

const HeaderDiv = styled.div`
  display: flex;
  margin: 60px 0 0 0;
  h1 {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }
`;

const SaveButton = styled(Button)`
  margin-left: auto;
`;

export default StoreHeader;
