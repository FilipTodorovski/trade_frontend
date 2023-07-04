import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

import styled from 'styled-components';
import { postcodeValidator } from 'postcode-validator';
import { Form, Button, Row, Col } from 'react-bootstrap';

import StoreFrontMasterComponent from 'sharedComponents/StoreFrontMasterComponent';
import Header from 'sharedComponents/StoreFrontHeader';
import FoodTypeBannerImg from 'sharedComponents/FoodTypeBannerImg';
import FavouriteFoodSlider from 'sharedComponents/FavouriteFoodSlider';
import Footer from 'sharedComponents/StoreFrontFooter';

import LineConnectorConcaveSvg from 'svg/Line-connector-Concave.svg';
import LineConnectorConvexSvg from 'svg/Line-connector-convex.svg';

import { makeCapitalCase } from 'utils/string';
import { getTownsWithCity } from 'utils/townList';
import {
  LIGHTEST_PURPLE_COLOR,
  PRIMARY_DARK_COLOR,
  PRIMARY_ACTIVE_COLOR,
} from 'constants/constants';

const FoodTypeLanding = () => {
  const { city, foodtype } = useParams();
  const history = useHistory();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2,
    },
  };

  const [postcode, setPostcode] = useState({
    value: '',
    validate: true,
    errorMsg: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [city, foodtype]);

  const clickSearch = () => {
    if (postcode.value.length === 0) {
      setPostcode({
        ...postcode,
        validate: false,
        errorMsg: 'Please input postcode.',
      });
      return;
    }

    if (postcodeValidator(postcode.value.trim(), 'UK')) {
      history.push({
        pathname: '/store/list',
        search: `?postcode=${postcode.value.trim()}`.replace(/ /g, '+'),
      });
    } else {
      setPostcode({
        ...postcode,
        validate: false,
        errorMsg:
          'Sorry we did not recognise that postcode, check and try again',
      });
    }
  };

  return (
    <StoreFrontMasterComponent>
      <LayoutWrapper>
        <Header />
        <BannerSection>
          <div className="banner-container">
            <HeadContentWrapper>
              <h1 className="banner-title">
                Order {makeCapitalCase(foodtype)}
                <br />
                Takeaway in {makeCapitalCase(city)}
              </h1>
              <h4 className="banner-description">
                Order a {makeCapitalCase(foodtype)} takeaway in{' '}
                {makeCapitalCase(city)} tonight
              </h4>
              <SearchInputGroup>
                <SearchInput
                  type="text"
                  placeholder="Enter your postcode"
                  className="ht-form-control"
                  onChange={(e) => {
                    setPostcode({
                      ...postcode,
                      value: e.target.value,
                    });
                  }}
                  value={postcode.value}
                  isInvalid={!postcode.validate}
                />
                <StyledSearchButton onClick={clickSearch}>
                  Search
                </StyledSearchButton>
                <Form.Control.Feedback type="invalid">
                  {postcode.errorMsg}
                </Form.Control.Feedback>
              </SearchInputGroup>
            </HeadContentWrapper>
            <FoodTypeBannerImg foodType={foodtype} />
          </div>
        </BannerSection>
        <ServiceSection>
          <MainContainer>
            <div className="section-container">
              <SectionH2 center>
                How to order your favourite {makeCapitalCase(foodtype)} food{' '}
                <br /> from your local takeaway.
              </SectionH2>
              <div className="service-steps">
                <span>1</span>
                <img
                  src={LineConnectorConcaveSvg}
                  className="line-connector-concave"
                  alt="concave"
                />
                <span>2</span>
                <img
                  src={LineConnectorConvexSvg}
                  className="line-connector-convex"
                  alt="convex"
                />
                <span>3</span>
              </div>
              <div className="service-features">
                <div className="service">
                  <span className="mobile-view">1</span>
                  <h4>Browse the Menu</h4>
                  <p>
                    Browse the menu from your favourite{' '}
                    {makeCapitalCase(foodtype)} takeaway and select what you
                    would like.
                  </p>
                </div>
                <div className="service">
                  <span className="mobile-view">2</span>
                  <h4>Select the items</h4>
                  <p>
                    Select the items which type of food you would like to eat.
                  </p>
                </div>
                <div className="service">
                  <span className="mobile-view">3</span>
                  <h4>Sit back and relax</h4>
                  <p>
                    Wait until your takeaway food arrives piping hot at your
                    door by the delivery driver.
                  </p>
                </div>
              </div>
            </div>
          </MainContainer>
        </ServiceSection>
        <SlideSection>
          <MainContainer className="slide-container">
            <SectionH5>Your favourite Food</SectionH5>
            <SectionH2>
              Popular Food Choices in {makeCapitalCase(city)}
            </SectionH2>
            <FavouriteFoodSlider
              wrapperStyle={{ margin: '60px 0 0', position: 'relative' }}
              responsive={responsive}
            />
            <Button className="ht-btn-primary btn-see-all">
              See all Cusines
            </Button>
          </MainContainer>
        </SlideSection>
        <CountrySelectSection>
          <MainContainer className="cityselect-container">
            <SectionH5>
              {makeCapitalCase(foodtype)} in {makeCapitalCase(city)} Food Near
              You
            </SectionH5>
            <SectionH2>Area within {makeCapitalCase(city)}</SectionH2>
            <Row className="city-content">
              {getTownsWithCity(city).map((item, idx) => {
                return (
                  <Col className="order-content-col" xs={3} key={idx}>
                    <h5 className="mb-4">
                      <Link
                      // to={`/takeaway/Aberdeen/${makeCapitalCase(foodtype)}`}
                      >
                        {item}
                      </Link>
                    </h5>
                  </Col>
                );
              })}
            </Row>
          </MainContainer>
        </CountrySelectSection>
        <Footer />
      </LayoutWrapper>
    </StoreFrontMasterComponent>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledSearchButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #27ae60;
  color: #fff;
  width: 165px;
  height: 52px;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  position: absolute;
  right: 4px;
  top: 4px;

  :hover {
    filter: brightness(0.8);
    color: #fff;
  }
  :active {
    filter: brightness(0.8);
    color: #fff;
  }

  @media (max-width: 1024px) {
    width: 105px;
    height: 42px;
    top: 9px;
    right: 3px;
  }
`;

const MainContainer = styled.div`
  display: flex;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const BannerSection = styled.div`
  background-color: ${LIGHTEST_PURPLE_COLOR};
  width: 100%;
  height: 698px;
  position: relative;
  display: flex;
  padding: 0 80px;
  overflow: hidden;

  @media (max-width: 1600px) {
    height: 600px;
  }

  @media (max-width: 1440px) {
    height: 550px;
  }

  @media (max-width: 1279px) {
    height: 500px;
    padding: 0 42px;
  }

  @media (max-width: 1023px) {
    flex-wrap: wrap;
    height: auto;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    padding: 0 37px;
  }

  .banner-container {
    display: flex;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding-top: 57px;

    @media (max-width: 1023px) {
      flex-direction: column;
    }
  }
`;

const HeadContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  position: relative;
  flex: 1 1 45%;
  height: 100%;

  @media screen and (max-width: 1023px) {
    padding: 0;
    align-items: center;
    width: 100%;
    margin-top: 50px;
    display: block;
    min-height: 190px;
  }

  .banner-title {
    font-size: 48px;
    color: #0b0c0c;
    font-weight: 600;

    @media screen and (max-width: 1023px) {
      max-width: 100%;
      text-align: center;
    }

    @media screen and (max-width: 479px) {
      font-size: 2.7em;
    }
  }
  .banner-description {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: ${PRIMARY_DARK_COLOR};
    margin: 29px 0 32px;
    color: #0b0c0c;
    @media screen and (max-width: 1023px) {
      max-width: 100%;
      text-align: center;
    }
  }
`;

const SearchInputGroup = styled(Form.Group)`
  display: flex;
  position: relative;
  flex-direction: column;
  max-width: 480px;

  @media screen and (max-width: 1023px) {
    margin: 20px auto;
  }
`;

const SearchInput = styled(Form.Control)`
  border: 2px solid #fff;
  border-radius: 12px;
  padding 19px 185px 19px 24px;  
  font-size: 1.05em;
  width: 480px;
  height: 60px;
  max-width: 100%;
  background-color: white;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  @media screen and (max-width: 767px) {
    padding-right: 100px;
  }
`;

const ServiceSection = styled.div`
  width: 100%;
  position: relative;
  z-index: 10;
  background: white;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .section-container {
    padding: 120px 0;
    width: 100%;

    @media (max-width: 1024px) {
      padding: 80px 0;
    }

    @media (max-width: 767px) {
      padding: 60px 0;
    }
  }

  .service-steps {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 767px) {
      display: none;
    }

    span {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${PRIMARY_ACTIVE_COLOR};
      color: white;
      border-radius: 100%;
      font-size: 24px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      margin: 0 15px;

      @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
      }
    }

    img.line-connector-concave {
      margin-top: -40px;
      width: 300px;
      height: 30px;

      @media (max-width: 1024px) {
        width: 200px;
      }
    }

    img.line-connector-convex {
      margin-top: 30px;
      width: 300px;
      height: 30px;

      @media (max-width: 1024px) {
        width: 200px;
      }
    }
  }

  .service-features {
    display: flex;
    width: 1000px;
    justify-content: space-between;
    margin: 0 auto;

    @media (max-width: 1024px) {
      width: 740px;
    }

    @media (max-width: 767px) {
      width: 100%;
      flex-direction: column;
    }

    .service {
      width: 270px;
      text-align: center;
      margin: 52px 0 0 0;

      @media (max-width: 1024px) {
        width: 200px;
      }

      @media (max-width: 767px) {
        width: 220px;
        margin: 30px auto 0;
      }

      h4 {
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #0b0c0c;

        @media (max-width: 1024px) {
          font-size: 18px;
        }

        @media (max-width: 767px) {
          margin: 12px 0;
        }
      }

      p {
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #0b0c0c;

        @media (max-width: 1024px) {
          font-size: 14px;
        }
      }

      span.mobile-view {
        display: none;

        @media (max-width: 767px) {
          display: block;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${PRIMARY_ACTIVE_COLOR};
          color: white;
          border-radius: 100%;
          font-size: 14px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          margin: 0 auto;
        }
      }
    }
  }
`;

const SlideSection = styled.div`
  display: flex;
  padding: 80px 0 71px;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 1024px) {
    padding: 60px 0 80px;
  }

  .slide-container {
    flex-direction: column;
    .btn-see-all {
      padding-left: 0;
      padding-right: 0;
      justify-self: center;
      align-self: center;
      width: 191px;
      margin: 50px 0 0 0;
    }
  }
`;

const SectionH5 = styled.h5`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1.68px;
  color: #505a5f;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
`;

const SectionH2 = styled.h2`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 32px;
  font-weight: bold;
  color: #0b0c0c;
  @media screen and (max-width: 767px) {
    font-size: 24px;
  }
`;

const CountrySelectSection = styled.div`
  display: flex;
  padding: 80px 0 71px;
  justify-content: center;
  flex-direction: column;
  background: #f6f1ff;
  min-height: 700px;

  @media (max-width: 768px) {
    nmin-height: 480px;
  }

  .cityselect-container {
    flex-direction: column;
    justify-content: flex-start;
  }

  .city-content {
    display: flex;
    margin: 47px auto 0;
    max-width: 1024px;
    width: 100%;

    @media screen and (max-width: 767px) {
      flex-wrap: wrap;
    }

    .order-content-col {
      h5 {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        color: #0b0c0c;
        text-transform: capitalize;
        display: flex;
        flex-wrap: wrap;
        word-break: break-all;
        text-align: center;
        a {
          width: 100%;
          color: #0b0c0c;
          text-decoration: none;
          text-align: center;
          white-space: break-spaces;
          word-break: break-word;
        }
      }
    }
  }
`;

export default FoodTypeLanding;
