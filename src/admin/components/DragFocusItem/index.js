import React from 'react';
import styled from 'styled-components';

const DragFocusItem = () => {
  return (
    <DotContainer>
      <DotRow>
        <Dot />
        <Dot />
        <Dot />
      </DotRow>
      <DotRow>
        <Dot />
        <Dot />
        <Dot />
      </DotRow>
    </DotContainer>
  );
};

const DotContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25px;
  height: 13px;
  justify-content: space-between;
  cursor: pointer;
`;

const DotRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  background-color: rgba(39, 40, 72, 0.3);
  border-radius: 5px;
`;
export default DragFocusItem;
