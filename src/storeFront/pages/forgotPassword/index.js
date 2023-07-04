import React from 'react';
import styled from 'styled-components';
import LogoSVG from 'svg/logo-menu.svg';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

const ForgotPassword = () => {
  return (
    <Container className="container d-flex flex-column justify-content-center">
      <Row>
        <Col md="6" className="offset-md-3">
          <LogoDiv className="d-flex justify-content-center">
            <img src={LogoSVG} alt="logo" />
          </LogoDiv>
          <h4 className="d-flex justify-content-center">
            Please enter your email
          </h4>
          <Card>
            <Card.Body>
              <Form.Group as={Col} md="12">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeHolder="Email"
                  value={FormData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;

  input[type='text'],
  input[type='password'] {
    height: 52px;
    padding: 16px;
  }

  .ht-btn-primary {
    padding: 16px 28px;
    height: 52px;
    border-radius: 5px;
  }
`;

const LogoDiv = styled.h2`
  img {
    width: 50px;
  }
`;

export default ForgotPassword;
