import React from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import AppContainer from '../../../../components/AppContainer';
import TopSectionSelector from '../TopSectionSelector';

const MenuPage = ({ curSection, children }) => {
  return (
    <AppContainer>
      <MenuContainer>
        <TopSectionSelector curSection={curSection} />
        <SectionContainer>{children}</SectionContainer>
      </MenuContainer>
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  padding: 0 31px;
`;

export default withRouter(MenuPage);
