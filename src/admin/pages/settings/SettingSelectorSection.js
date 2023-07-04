import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const SettingSelectorSection = () => {
  const history = useHistory();
  return (
    <Row>
      <Col md="4" className="d-flex justify-content-center">
        <SettingItem
          onClick={() => {
            history.push('/settings/payments');
          }}
          role="button"
        >
          <div className="icon-div">
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <div className="content">
            <h6 className="text-primary">Payments</h6>
            <p>Enable and manager your store's payment providers</p>
          </div>
        </SettingItem>
      </Col>
    </Row>
  );
};

const SettingItem = styled.div`
  display: flex;
  cursor: pointer;
  max-width: 250px;
  margin-top: 1rem;

  .icon-div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    background-color: #dcdcdc;
    border-radius: 4px;
    flex: 1 0 42px;

    .svg-inline--fa {
      font-size: 20px;
      color: #93989f;
    }
  }

  .content {
    margin-left: 1rem;
  }
`;

export default SettingSelectorSection;
