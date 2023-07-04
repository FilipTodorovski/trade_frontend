import React from 'react';

import styled from 'styled-components';
import { useFormik } from 'formik';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import Lottie from 'lottie-react';

import StoreFrontHeader from 'sharedComponents/StoreFrontHeader';
import StoreFrontFooter from 'sharedComponents/StoreFrontFooter';
import { registerRestaurantSchema } from 'validators';
import PoundSvg from 'assets/images/res-register-pound.svg';
import MobileSvg from 'assets/images/res-register-mobile.svg';
import ChartSvg from 'assets/images/res-register-chart.svg';
import { getAssetsCloudImage } from 'utils/cloudImg';
import {
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_ACTIVE_BACK_COLOR,
} from 'constants/constants';
import CONFIG from '../../../config';
import lottie1 from 'assets/lotties/tradesprint-imageone.json';
import lottie2 from 'assets/lotties/tradesprint-imagetwo.json';
import lottie3 from 'assets/lotties/tradesprint-imagethree.json';

const RegisterRestaurantPage = () => {
  const formIk = useFormik({
    initialValues: {
      FIRST_NAME: '',
      LAST_NAME: '',
      RESTAURANT_NAME: '',
      // address: '',
      email: '',
      PHONE: '',
      FORM_ID: CONFIG.CAPSULE_WEBSITE_KEY,
      COMPLETE_URL: 'http://capsulecrm.com',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: registerRestaurantSchema,
  });

  return (
    <ComponentContainer>
      <StoreFrontHeader />
      <SectionOne>
        <MainContainer className="d-flex">
          <Row>
            <Col md="6" className="left-panel">
              <h1>Allow your customers to order online from their jobs</h1>
              <h4>
                Unlock your Merchant to new buyers, increase your revenue and
                margins with Trade Sprint
              </h4>
            </Col>
            <Col md="6" className="right-panel">
              <Card className="register-form ht-card">
                <h4>Join us today</h4>
                <Form
                  action="https://service.capsulecrm.com/service/newlead"
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="FORM_ID"
                    value={CONFIG.CAPSULE_WEBSITE_KEY}
                  />
                  <input
                    type="hidden"
                    name="COMPLETE_URL"
                    value={'http://capsulecrm.com'}
                  />
                  <Row>
                    <Form.Group as={Col} xs="6">
                      <Form.Control
                        className="ht-form-control"
                        name="FIRST_NAME"
                        type="text"
                        placeholder="First Name"
                        value={formIk.values.FIRST_NAME}
                        onChange={formIk.handleChange}
                        onBlur={formIk.handleBlur}
                        isInvalid={
                          formIk.touched.FIRST_NAME && formIk.errors.FIRST_NAME
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formIk.errors.FIRST_NAME}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs="6">
                      <Form.Control
                        className="ht-form-control"
                        name="LAST_NAME"
                        type="text"
                        placeholder="Last Name"
                        value={formIk.values.LAST_NAME}
                        onChange={formIk.handleChange}
                        onBlur={formIk.handleBlur}
                        isInvalid={
                          formIk.touched.LAST_NAME && formIk.errors.LAST_NAME
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formIk.errors.LAST_NAME}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs="12">
                      <Form.Control
                        className="ht-form-control"
                        name="RESTAURANT_NAME"
                        type="text"
                        placeholder="Merchant Name"
                        value={formIk.values.RESTAURANT_NAME}
                        onChange={formIk.handleChange}
                        onBlur={formIk.handleBlur}
                        isInvalid={
                          formIk.touched.RESTAURANT_NAME &&
                          formIk.errors.RESTAURANT_NAME
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formIk.errors.RESTAURANT_NAME}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {/* <Form.Group as={Col} xs="12">
                          <Form.Control
                            className="ht-form-control"
                            name="address"
                            type="text"
                            placeholder="Restaurant Address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.address && errors.address}
                            autoComplete="new-password"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.address}
                          </Form.Control.Feedback>
                        </Form.Group> */}
                    <Form.Group as={Col} xs="12">
                      <Form.Control
                        className="ht-form-control"
                        name="EMAIL"
                        type="text"
                        placeholder="Email"
                        value={formIk.values.EMAIL}
                        onChange={formIk.handleChange}
                        onBlur={formIk.handleBlur}
                        isInvalid={formIk.touched.EMAIL && formIk.errors.EMAIL}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formIk.errors.EMAIL}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs="12">
                      <Form.Control
                        className="ht-form-control"
                        name="PHONE"
                        type="text"
                        placeholder="Mobile Phone i.e 07535253673"
                        value={formIk.values.PHONE}
                        onChange={formIk.handleChange}
                        onBlur={formIk.handleBlur}
                        isInvalid={formIk.touched.PHONE && formIk.errors.PHONE}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formIk.errors.PHONE}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs="12" className="d-flex">
                      <Button className="ht-btn-primary" type="submit">
                        Sign up
                      </Button>
                    </Form.Group>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </MainContainer>
      </SectionOne>
      <SectionTwo>
        <MainContainer style={{ flexDirection: 'column' }}>
          <Row>
            <Col md="12">
              <h4>Why Partner with Trade Sprint?</h4>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <div className="content">
                <img src={PoundSvg} alt="Pound" />
                <h5>Low commissions</h5>
                <p>
                  We charge you ta small percentage and so all the advertising
                  on your behalf to customers.
                </p>
              </div>
            </Col>
            <Col md="4">
              <div className="content">
                <img src={MobileSvg} alt="Pound" />
                <h5>Order Received</h5>
                <p>
                  The order is received and processed by the builders merchant.
                </p>
              </div>
            </Col>
            <Col md="4">
              <div className="content">
                <img src={ChartSvg} alt="Pound" />
                <h5>Item Dispatched</h5>
                <p>
                  The item will then either be available for click and collect
                  or delivered to your job.
                </p>
              </div>
            </Col>
          </Row>
        </MainContainer>
      </SectionTwo>
      <SectionThree>
        <MainContainer>
          <Row>
            <Col md="6" className="show-desktop">
              <Lottie animationData={lottie1} style={{ width: '70%' }} />
            </Col>
            <Col md="6" className="d-flex align-items-center">
              <SectinContentOne className="content">
                <CircleNumber>1</CircleNumber>
                <h4>Customer Places Order</h4>
                <p>
                  Customers will place an order online at Trade Sprint website.
                  All you have to do is link from your own website. Orders will
                  start to come through to your computer or tablet.
                  <br />
                  <br />
                  You will be given all the order details, including the
                  customers address and order details.
                </p>
              </SectinContentOne>
            </Col>
            <Col md="6" className="show-mobile">
              <SectionImg
                className="back-img"
                src={getAssetsCloudImage('Rectangle24.jpg')}
                alt="section 3"
              />
            </Col>
          </Row>
        </MainContainer>
      </SectionThree>
      <SectionFour>
        <MainContainer>
          <Row>
            <Col md="6" className="d-flex align-items-center">
              <SectinContentOne>
                <CircleNumber>2</CircleNumber>
                <h4>You prepare the order</h4>
                <p>
                  Once the order has been accepted you start to prepare the
                  order on behalf of the customer.
                  <br />
                  <br />
                  We notify the customer all the way through the ordering
                  process. They will get updates by email on the status of the
                  order.
                </p>
              </SectinContentOne>
            </Col>
            <Col md="6" style={{ marginBottom: '40px' }}>
              <Lottie animationData={lottie2} style={{ width: '70%' }} />
            </Col>
          </Row>
        </MainContainer>
      </SectionFour>
      <SectionFive>
        <MainContainer>
          <Row>
            <Col
              md="6"
              style={{ marginBottom: '40px' }}
              className="show-desktop"
            >
              <Lottie animationData={lottie3} style={{ width: '70%' }} />
            </Col>
            <Col
              md="6"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <SectinContentOne className="content">
                <CircleNumber>3</CircleNumber>
                <h4>You Deliver the order</h4>
                <p>
                  Deliver the order direct to your customer using your own house
                  delivery team.
                  <br />
                  <br />
                  We are in the process of setting up a delivery network but
                  right now, its not available.
                </p>
              </SectinContentOne>
            </Col>
            <Col
              md="6"
              className="show-mobile"
              style={{ marginBottom: '40px' }}
            >
              <SectionImg
                className="back-img"
                src={getAssetsCloudImage('TradeSprintdelivery.jpg')}
                alt="section 5"
              />
            </Col>
          </Row>
        </MainContainer>
      </SectionFive>
      <QuestionSection>
        <MainContainer>
          <Row>
            <Col className="section-col">
              <h2>Got questions? We're on hand to help</h2>
              <Button className="btn-speak ht-btn-primary">
                Speak to our Team
              </Button>
            </Col>
          </Row>
        </MainContainer>
      </QuestionSection>
      <StoreFrontFooter />
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .show-mobile {
    display: none;
  }
  @media screen and (max-width: 767px) {
    .show-desktop {
      display: none !important;
    }
  }
`;

const MainContainer = styled(Container)`
  max-width: 1200px;
  width: 100%;
`;

const SectionOne = styled.div`
  display: flex;
  min-height: 693px;
  padding: 50px 0;
  background: linear-gradient(0deg, #213f5e, #213f5e);
  .left-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    h1 {
      font-style: normal;
      font-weight: 600;
      font-size: 2.7em;
      line-height: 1.1;
      color: #fff;
      margin: 0 0 29px 0;
    }
    h4 {
      font-style: normal;
      font-weight: 600;
      font-size: 23px;
      line-height: 1.2;
      color: #fff;
      margin: 0;
    }
  }
  .right-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .register-form {
      max-width: 500px;
      margin: 0 0 0 40px;
      padding: 30px 43px 23px 43px;
      h4 {
        font-weight: 600;
        font-size: 32px;
        line-height: 1.2;
        text-align: center;
        color: #0b0c0c;
        margin: 0 0 28px 0;
      }
      .form-group {
        margin-bottom: 23px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .ht-btn-primary {
        width: 135px;
        padding-left: 0;
        padding-right: 0;
        margin: 0 auto;
      }
    }
  }

  @media screen and (max-width: 1199px) {
    .left-panel {
      h1 {
        font-size: 50px;
      }
      h4 {
        font-size: 30px;
      }
    }
    .right-panel {
      .register-form {
        h4 {
          font-size: 30px;
        }
      }

    }
  }
  @media screen and (max-width: 1023px) {
    .left-panel {
      flex: 0 0 100%;
      max-width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
      h1,
      h4 {
        text-align: center;
      }
    }
    .right-panel {
      flex: 0 0 100%;
      max-width: 100%;
      display: flex;
      justify-content: center;
      .register-form {
        margin 0 auto;
      }
    }
  }

  @media screen and (max-width: 767px) {
    .left-panel {
      h1 {
        font-size: 30px;
      }
      h4 {
        font-size: 20px;
      }
    }
    .right-panel {
      .register-form {
        h4 {
          font-size: 20px;
        }
      }
    }
  }
`;

const SectionTwo = styled.div`
  background-color: #fff;
  padding: 87px 0 40px;
  h4 {
    font-weight: 600;
    font-size: 32px;
    line-height: 39px;
    color: #0b0c0c;
    margin: 0 0 68px 0;
    text-align: center;
  }
  .content {
    max-width: 290px;
    margin: 0 auto 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h5 {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      margin: 26px 0 0 0;
    }
    p {
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      color: #0b0c0c;
      margin: 23px 0 0 0;
    }
  }
`;

const SectionThree = styled.div`
  background-color: ${PRIMARY_ACTIVE_BACK_COLOR};
  padding: 161px 0 120px;

  .col-md-6 {
    margin-bottom: 40px;
  }

  .content {
    margin: 0 0 0 100px;
    @media screen and (max-width: 1023px) {
      margin: 0;
      max-width: 100%;
    }
  }

  @media screen and (max-width: 767px) {
    padding: 80px 0 20px;
    .col-md-6 {
      display: flex;
      justify-content: center;
    }
  }
`;

const SectionFour = styled.div`
  background-color: white;
  padding: 98px 0 69px;
  .col-md-6 {
    margin-bottom: 40px;
  }
  @media screen and (max-width: 767px) {
    padding: 40px 0 20px;
    .col-md-6 {
      display: flex;
      justify-content: center;
    }
  }
`;

const SectionFive = styled.div`
  background-color: ${PRIMARY_ACTIVE_BACK_COLOR};
  padding: 98px 0 69px;
  .content {
    margin-left: 100px;
  }
  .col-md-6 {
    margin-bottom: 40px;
  }
  @media screen and (max-width: 767px) {
    padding: 60px 0 20px;
    .col-md-6 {
      display: flex;
      justify-content: center;
    }
    .content {
      margin: 0;
    }
  }
`;

const SectinContentOne = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 401px;
  h4 {
    font-weight: 600;
    font-size: 32px;
    line-height: 39px;
    margin: 33px 0 0 0;
  }
  p {
    margin: 17px 0 0 0;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
  }
  @media screen and (max-width: 767px) {
    align-items: center;
    h4 {
      text-align: center;
    }
    p {
      text-align: center;
    }
  }
`;

const SectionImg = styled.img`
  width: 100%;
  max-width: 549px;
  height: auto;
`;

const CircleNumber = styled.div`
  width: 50px;
  height: 50px;
  color: white;
  border-radius: 25px;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${PRIMARY_ACTIVE_COLOR};
`;

const QuestionSection = styled.div`
  padding: 131px 0;
  .section-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h2 {
    font-weight: 600;
    font-size: 2.7em;
    line-height: 1.2;
    color: #0b0c0c;
    margin: 0;
  }
  .btn-speak {
    width: 280px;
    height: 72px;
    margin-left: 43px;
  }

  @media screen and (max-width: 1100px) {
    padding: 65px 0;
    .section-col {
      flex-direction: column;
    }
    h2 {
      font-size: 30px;
      text-align: center;
    }
    .btn-speak {
      height: 72px;
      margin: 30px 0 0 0;
    }
  }
`;

export default RegisterRestaurantPage;
