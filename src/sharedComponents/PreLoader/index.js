import React from 'react';

import styled from 'styled-components';
import HtSpinner from 'admin/components/HtSpinner';

const PreLoader = () => {
  return (
    <ComponentContainer>
      <HtSpinner />
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%:
  height: 100vh;
  position: relative;
`;

export default PreLoader;
