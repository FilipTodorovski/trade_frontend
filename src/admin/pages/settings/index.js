import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import AppContainer from '../../components/AppContainer';
import SettingSelectorSection from './SettingSelectorSection';

const SettingsPage = () => {
  const [curPage, setPage] = useState('Settings');

  useEffect(() => {
    setPage('Settings');
  }, []);

  return (
    <AppContainer>
      <Container className="p-4">
        <h3 className="title mb-4">Settings</h3>
        <Card className="setting-container ht-card mt-0">
          <Card.Body>
            {curPage === 'Settings' && (
              <SettingSelectorSection
                selectPage={(newPage) => {
                  setPage(newPage);
                }}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </AppContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  max-width: 1280px;

  .setting-container {
    flex: 1 1 100%;
    overflow-y: auto;
  }
`;

export default withRouter(SettingsPage);
