import React from 'react';
import styled from 'styled-components';
import HamburgarSvg from '../../svg/hambyurger.png';

import * as CONSTANTS from '../../constants';

const HamburgerImgDiv = () => {
  return (
    <>
      <HeadBannerImageWrapper>
        <HeadBannerBackground />
        <img src={HamburgarSvg} alt="Hamburger" />
      </HeadBannerImageWrapper>
    </>
  );
};

const HeadBannerImageWrapper = styled.div`
  flex: 1 1 55%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 500px;

  @media (max-width: 1024px) {
    height: 330px;
  }

  @media (max-width: 1023px) {
    flex: 0 0 100%;
    height: 250px;
    min-height: 250px;
    max-height: 250px;
  }

  img {
    z-index: 2;
    width: 400px;
    height: 343px;
    margin-bottom: -343px;

    @media (min-width: 1600px) {
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 40px;
        }
        100% {
          margin-bottom: 40px;
        }
      }
    }

    @media (max-width: 1599px) {
      width: 400px;
      height: 343px;
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 40px;
        }
        100% {
          margin-bottom: 40px;
        }
      }
    }

    @media (max-width: 1439px) {
      width: 373px;
      height: 320px;
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 40px;
        }
        100% {
          margin-bottom: 40px;
        }
      }
    }

    @media (min-width: 1280px) and (max-width: 1339px) {
      width: 350px;
      height: 300px;
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 40px;
        }
        100% {
          margin-bottom: 40px;
        }
      }
    }

    @media (min-width: 1140px) and (max-width: 1279px) {
      width: 330px;
      height: 280px;
      animation: myfirst 5s infinite;
      transform: translateX(100px);
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 40px;
        }
        100% {
          margin-bottom: 40px;
        }
      }
    }

    @media (min-width: 1025px) and (max-width: 1139px) {
      width: 373px;
      height: 320px;
      transform: translateX(90px);
      margin-bottom: 40px;
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 40px;
        }
        100% {
          margin-bottom: 40px;
        }
      }
    }

    @media (max-width: 1024px) {
      width: 250px;
      height: 200px;
      margin-bottom: 20px;
      transform: translateX(90px);
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 20px;
        }
        100% {
          margin-bottom: 20px;
        }
      }
    }

    @media (max-width: 1023px) {
      width: 200px;
      height: 170px;
      margin-bottom: 20px;
      margin-left: 0;
      transform: translateX(0);
      animation: myfirst 5s infinite;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 20px;
        }
        100% {
          margin-bottom: 20px;
        }
      }
    }

    @media (max-width: 767px) {
      width: auto;
      height: 170px;
      @keyframes myfirst {
        0% {
          margin-bottom: -343px;
        }
        20% {
          margin-bottom: 20px;
        }
        100% {
          margin-bottom: 20px;
        }
      }
    }
  }
`;

const HeadBannerBackground = styled.div`
  width: 55vw;
  height: 55vw;
  position: absolute;
  right: -10%;
  top: 10%;
  background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  border-radius: 100%;
  z-index: 1;

  &:before {
    content: '';
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    position: absolute;
    top: -11.5px;
    left: -11.5px;
    border: 1.5px dashed ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    border-radius: 100%;
  }

  width: 704px;
  height: 704px;
  right: auto;

  @media (max-width: 1439px) {
    width: 604px;
    height: 604px;
    right: auto;
  }

  @media (min-width: 1140px) and (max-width: 1279px) {
    width: 705px;
    height: 705px;
    left: 20px;
  }

  @media (min-width: 1025px) and (max-width: 1139px) {
    width: 705px;
    height: 705px;
    left: 20px;
  }

  @media (max-width: 1024px) {
    left: 20px;
  }

  @media (max-width: 1023px) {
    width: 120vw;
    height: 120vw;
    left: auto;
    right: auto;
  }
`;

export default HamburgerImgDiv;
