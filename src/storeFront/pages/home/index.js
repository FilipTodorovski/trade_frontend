import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { postcodeValidator } from 'postcode-validator';
import { Form } from 'react-bootstrap';
import Lottie from 'lottie-react';

import StoreFrontMasterComponent from 'sharedComponents/StoreFrontMasterComponent';
import Header from 'sharedComponents/StoreFrontHeader';
import HamburgerImgDiv from 'sharedComponents/HamburgerImgDiv';
import FavouriteFoodSlider from 'sharedComponents/FavouriteFoodSlider';
import Footer from 'sharedComponents/StoreFrontFooter';

import LineConnectorConcaveSvg from 'svg/Line-connector-Concave.svg';
import LineConnectorConvexSvg from 'svg/Line-connector-convex.svg';
import lottie1 from 'assets/lotties/tradesprint-imageone.json';
import lottie2 from 'assets/lotties/tradesprint-imagetwo.json';
import lottie3 from 'assets/lotties/tradesprint-imagethree.json';

import * as CONSTANTS from 'constants/constants';
import { getAssetsCloudImage } from 'utils/cloudImg';

const HomePage = ({ history }) => {
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

  const handleKeyDownSearch = (event) => {
    if (event.keyCode === 13) {
      clickSearch();
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
                From Merchant to Job within 60 mins
              </h1>
              <span className="postcode-label">
                Enter a delivery postcode below
              </span>
              <SearchInputGroup>
                <SearchInput
                  type="text"
                  placeholder="e.g. DD4 9NZ"
                  className="ht-form-control"
                  onChange={(e) => {
                    setPostcode({
                      ...postcode,
                      value: e.target.value,
                    });
                  }}
                  onKeyDown={handleKeyDownSearch}
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
            <HamburgerImgDiv />
          </div>
        </BannerSection>
        <ServiceSection>
          <MainContainer>
            <div className="section-container">
              <H3 center>
                Order Online from your favourite Builders Merchants
              </H3>
              <div className="service-features">
                <div className="service">
                  <Lottie
                    animationData={lottie1}
                    style={{ width: 150, height: 150 }}
                  />
                  <span className="mobile-view">1</span>
                  <h4>Browse what you need</h4>
                  <p>
                    Select the closest merchant and browse their products - No
                    need to leave the job.
                  </p>
                </div>
                <div className="service">
                  <Lottie
                    animationData={lottie2}
                    style={{ width: 150, height: 150 }}
                  />
                  <span className="mobile-view">2</span>
                  <h4>Order Received</h4>
                  <p>
                    The order is received and processed by the builders
                    merchant.
                  </p>
                </div>
                <div className="service">
                  <Lottie
                    animationData={lottie3}
                    style={{ width: 150, height: 150 }}
                  />
                  <span className="mobile-view">3</span>
                  <h4>Item Dispatched</h4>
                  <p>
                    The item will then either be available for click and collect
                    or delivered to your job.
                  </p>
                </div>
              </div>
            </div>
          </MainContainer>
        </ServiceSection>
        <SlideSection>
          <MainContainer className="slide-container">
            <h5>Your favourite Food</h5>
            <h2>Find the food you're craving right now</h2>
            <FavouriteFoodSlider
              wrapperStyle={{ margin: '60px 0 0', position: 'relative' }}
              responsive={responsive}
            />
          </MainContainer>
        </SlideSection>
        <HowItWorksSection>
          <MainContainer>
            <div className="how-it-works">
              <h5>How It works</h5>
              <h2>Order from your favourite Builder Merchants</h2>
              <p>
                Trade Sprint builders merchant delivery service makes it super
                easy to get your products delivered to your jobs within as
                little as 30 minutes. You’re still supporting & ordering direct
                from your favourite builders merchant or hardware store without
                leaving the job.
              </p>
              <p>
                No more going away from the job to nip to the builders
                merchants, no more sitting in traffic and no more losing money.
                Thats right, building materials and products delivered direct
                from your mobile phone whilst you get on with another job at the
                customers property.
              </p>
              <p>
                Time is money & the constant need to go to builders merchants
                costs tradesmen a fortune every year, adds wear and tear to your
                vans and leaves you frustrated - let us help and we will sprint
                out the building products direct to your job from the closest
                builders merchant.
              </p>
            </div>
            <div className="video-guide">
              <img
                className="video-img"
                src={
                  'https://tradesprint.ams3.digitaloceanspaces.com/hardware-store-order.jpeg'
                }
                alt="video"
              />
              {/* <img
                className="bubble-box"
                src={getAssetsCloudImage('BubbleBox.png')}
                alt="bubble"
              />
              <img
                className="video-img"
                src={getAssetsCloudImage('Video.png')}
                alt="video"
              /> */}
            </div>
          </MainContainer>
        </HowItWorksSection>
        {/* <DownloadAppSection>
          <MainContainer className="download-container">
            <div className="download-app">
              <h5>HAVE YOU GOT THE APP?</h5>
              <h2>Download the app</h2>
              <p>
                Get yours now - available on the iOS and <br></br> Android app
                stores!
              </p>
            </div>
            <img
              className="phone-img"
              src={getAssetsCloudImage('phone11.png')}
              alt="phone"
            />
            <div className="app-link-area">
              <a href>
                <img
                  src={getAssetsCloudImage('appstore-button.png')}
                  alt="AppStore"
                />
              </a>
              <a href>
                <img
                  src={getAssetsCloudImage('playstore-button.png')}
                  alt="GoogleStore"
                />
              </a>
            </div>
          </MainContainer>
        </DownloadAppSection> */}
        <Footer />
      </LayoutWrapper>
    </StoreFrontMasterComponent>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  max-width: 100vw;
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
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(33,63,94,1) 27%, rgba(95,191,249,1) 100%);
  width: 100%;
  height: 500px;
  position: relative;
  display: flex;
  padding: 0 80px;
  overflow: hidden;

  @media (max-width: 1024px) {
    height: 330px;
    padding: 0 42px;
  }

  @media (max-width: 1023px) {
    flex-wrap: wrap;
    height: auto;
  }

  @media (max-width: 767px) {
    height: auto;
    flex-direction: column;
    padding: 0 37px;
  }

  .banner-container {
    display: flex;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;

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
    height: 190px;
    min-height: 190px;
  }

  .banner-title {
    font-size: 2.9rem;
    max-width: 402px;
    color: #ffffff;
    font-weight: 700;
    padding-bottom: 0.3em;

    @media screen and (max-width: 1024px) {
      font-size: 34px;
    }

    @media screen and (max-width: 1023px) {
      max-width: 100%;
      text-align: center;
    }

    @media screen and (max-width: 479px) {
      font-size: 2.2em;
    }
  }

  .postcode-label {
    color: white;
    padding-bottom: 16px;
  }
`;

const SearchInputGroup = styled(Form.Group)`
  display: flex;
  position: relative;
  flex-direction: column;
  max-width: 480px;

  @media screen and (max-width: 1023px) {
    margin: 5px auto 20px;
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
  @media screen and (max-width: 479px) {
    font-size: 0.9em;
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

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
        margin-top: 20px;

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
          background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
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
  padding: 80px 0 120px;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 1024px) {
    padding: 60px 0 80px;
  }

  .slide-container {
    flex-direction: column;
  }

  h5 {
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
  }

  h2 {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 0;
    font-size: 1.5em;
    font-weight: bold;
  }
`;

const HowItWorksSection = styled.div`
  background-color: ${CONSTANTS.LIGHTEST_PURPLE_COLOR};
  padding: 100px 80px;
  display: flex;

  @media (max-width: 1024px) {
    padding: 100px 42px;
  }

  @media (max-width: 767px) {
    padding: 60px 37px;
    flex-direction: column;
  }

  .how-it-works {
    flex: 1 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 767px) {
      text-align: center;
    }

    h5 {
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: 1.68px;
      color: #505a5f;
      text-transform: uppercase;
      margin-right: 21px;

      @media (max-width: 1024px) {
        font-size: 12px;
      }
    }

    h2 {
      font-size: 32px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      margin: 15px 21px 15px 0;
      color: #0b0c0c;

      @media (max-width: 1024px) {
        font-size: 22px;
      }
    }

    p {
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      margin: 10px 21px 10px 0;

      @media (max-width: 1024px) {
        font-size: 12px;
      }

      @media (max-width: 767px) {
        font-size: 16px;
      }
    }
  }
  .video-guide {
    flex: 1 0 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .video-img {
      width: calc(50%);
      position: relative;
      z-index: 2;
    }
    .bubble-box {
      position: absolute;
      top: -21px;
      right: 0px;
      z-index: 1;
    }

    @media (max-width: 767px) {
      margin-top: 40px;
    }
  }
`;

const DownloadAppSection = styled.div`
  padding: 60px 80px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    padding: 60px 42px 0;
  }

  @media (max-width: 767px) {
    padding: 60px 37px 0;
    flex-direction: column;
    text-align: center;
  }

  .download-container {
    justify-content: space-between;
    align-items: center;
  }

  h5 {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 1.68px;
    color: #505a5f;
    text-transform: uppercase;

    @media (max-width: 1024px) {
      font-size: 12px;
    }
  }

  h2 {
    font-size: 32px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    margin: 15px 0;
    color: #0b0c0c;
    @media (max-width: 1024px) {
      font-size: 22px;
    }
  }

  p {
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    margin: 10px 0;

    @media (max-width: 1024px) {
      font-size: 12px;
    }

    @media (max-width: 767px) {
      font-size: 16px;
    }
  }

  img.phone-img {
    width: 25%;

    @media (max-width: 767px) {
      display: none;
    }
  }

  .app-link-area {
    width: 290px;
    height: 290px;
    background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    border-radius: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    right: 10px;

    @media (max-width: 1024px) {
      width: 190px;
      height: 190px;
    }

    @media (max-width: 767px) {
      margin: 50px 0;
    }

    &:before {
      content: '';
      width: 306px;
      height: 306px;
      position: absolute;
      top: -8px;
      height: -8px;
      border: 1px dashed ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
      border-radius: 100%;

      @media (max-width: 1024px) {
        width: 206px;
        height: 206px;
      }
    }
  }
`;

const H3 = styled.h3`
  text-align: center;
  color: #0b0c0c;
  font-size: 32px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin: 0;

  @media (max-width: 767px) {
    font-size: 22px;
  }
`;

export default withRouter(HomePage);
