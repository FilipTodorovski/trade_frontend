import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { postcodeValidator } from 'postcode-validator';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Form } from 'react-bootstrap';

import Header from '../sharedComponents/StoreFrontHeader';
import HamburgerImgDiv from '../sharedComponents/HamburgerImgDiv';
import ButtonGroup from '../sharedComponents/CarouselButtonGroup';
import Footer from '../sharedComponents/StoreFrontFooter';

import LineConnectorConcaveSvg from '../svg/Line-connector-Concave.svg';
import LineConnectorConvexSvg from '../svg/Line-connector-convex.svg';
import Food1Svg from '../svg/Food1.svg';
import Food2Svg from '../svg/Food2.svg';
import Food3Svg from '../svg/Food3.svg';
import Food4Svg from '../svg/Food4.svg';
import BubbleBoxImg from '../svg/BubbleBox.png';
import VideoImg from '../svg/Video.png';
import PhoneImg from '../svg/phone11.png';
import AppStoreButtonImg from '../svg/appstore-button.png';
import PlaystoreButtonImg from '../svg/playstore-button.png';

import * as CONSTANTS from '../constants';

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
        errorMsg: 'Please enter a postcode.',
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
        errorMsg: 'Enter a postcode, like AA1 1AA',
      });
    }
  };

  return (
    <LayoutWrapper>
      <Header />
      <BannerSection>
        <div className="banner-container">
          <HeadContentWrapper>
            <h1 className="banner-title">
              From Merchant to Job within 60 mins
            </h1>
            <SearchInputGroup>
              <SearchInput
                type="text"
                placeholder="Enter your delivery postcode"
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
          <HamburgerImgDiv />
        </div>
      </BannerSection>
      <ServiceSection>
        <MainContainer>
          <div className="section-container">
            <H3 center>Order Online from your favourite Builders Merchants</H3>
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
                <h4>Browse what you need</h4>
                <p>
                  Select the closest merchant and browse their products - No
                  need to leave the job.
                </p>
              </div>
              <div className="service">
                <span className="mobile-view">2</span>
                <h4>Order Received</h4>
                <p>
                  The order is received and processed by the builders merchant.
                </p>
              </div>
              <div className="service">
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
      {/* <SlideSection>
        <MainContainer className="slide-container">
          <h5>Your favourite Food</h5>
          <h2>Find the food you're craving right now</h2>
          <div className="carousel-container">
            <Carousel
              responsive={responsive}
              arrows={false}
              renderButtonGroupOutside
              customButtonGroup={<ButtonGroup />}
            >
              <div className="home-carousel">
                <img src={Food1Svg} alt="Food1" />
                <h4>Italian food</h4>
              </div>
              <div className="home-carousel">
                <img src={Food2Svg} alt="Food2" />
                <h4>Mexican food</h4>
              </div>
              <div className="home-carousel">
                <img src={Food3Svg} alt="Food3" />
                <h4>Japanese food</h4>
              </div>
              <div className="home-carousel">
                <img src={Food4Svg} alt="Food4" />
                <h4>Chinese food</h4>
              </div>
              <div className="home-carousel">
                <img src={Food1Svg} alt="Food5" />
                <h4>Italian food</h4>
              </div>
              <div className="home-carousel">
                <img src={Food2Svg} alt="Food6" />
                <h4>Mexican food</h4>
              </div>
              <div className="home-carousel">
                <img src={Food4Svg} alt="Food7" />
                <h4>Chinese food</h4>
              </div>
            </Carousel>
          </div>
        </MainContainer>
      </SlideSection> */}
      <HowItWorksSection>
        <MainContainer>
          <div className="how-it-works">
            <h5>How It works</h5>
            <h2>
              We bring your favorite <br></br> takeaway to your door
            </h2>
            <p>
              Choose your favorite takeaway and order from our platform.
              <br></br> You’ll receive notifications as your order gets ready to
              be <br></br>delivered, and in no-time you’ll find it at your door.
            </p>
          </div>
          <div className="video-guide">
            <img className="bubble-box" src={BubbleBoxImg} />
            <img className="video-img" src={VideoImg} />
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
          <img className="phone-img" src={PhoneImg} alt="phone" />
          <div className="app-link-area">
            <a>
              <img src={AppStoreButtonImg} alt="AppStore" />
            </a>
            <a>
              <img src={PlaystoreButtonImg} alt="GoogleStore" />
            </a>
          </div>
        </MainContainer>
      </DownloadAppSection> */}
      <Footer />
    </LayoutWrapper>
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
  background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
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
    flex: 0 0 100%;
    height: 190px;
    min-height: 190px;
  }

  .banner-title {
    font-size: 68px;
    max-width: 402px;
    color: #0b0c0c;
    font-weight: 600;

    @media screen and (max-width: 1024px) {
      font-size: 54px;
    }

    @media screen and (max-width: 1023px) {
      max-width: 100%;
      text-align: center;
    }

    @media screen and (max-width: 479px) {
      font-size: 2.7em;
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
  border-color: rgb(223, 223, 223);
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
      background-color: #ff5057;
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

  .carousel-container {
    margin: 60px 0 0;
    position: relative;

    .react-multi-carousel-list {
      margin: 0 80px;

      ul li:hover {
        text-decoration: none;
      }

      @media (max-width: 1024px) {
        margin: 0 42px;
      }

      @media (max-width: 767px) {
        margin: 0 37px;
      }

      .home-carousel {
        padding: 0 15px;

        img {
          width: 100%;
          float: left;
        }

        h4 {
          border-bottom: 1px solid #dedede;
          padding-bottom: 6px;
          float: left;
          width: 100%;
          margin: 12px 0;
          font-weight: bold;
          font-size: 16px;
          color: #0b0c0c;
        }
      }
    }
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

    .video-img {
      width: calc(100% - 21px);
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

const H1 = styled.h1`
  font-size: 3.75em;
  text-align: left;
  color: #0b0c0c;
  font-size: 68px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin: 0;

  a {
    text-decoration: none;
  }

  @media (max-width: 1024px) {
    font-size: 54px;
  }

  @media (max-width: 767px) {
    text-align: center;
    font-size: 48px;
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
