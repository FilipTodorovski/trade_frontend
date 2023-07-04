import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as CONSTANTS from 'constants/constants';
import ShapeSvg from 'svg/shape.svg';

const StoreFrontFooter = () => {
  return (
    <div id="footer-wrapper">
      <SiteMapSection>
        <MainContainer className="sitemap-container">
          {/* <div className="sitemap-row">
            <div className="top-cities sub-section">
              <h4>Top cities</h4>
              <ul>
                <li>
                  <Link to="/takeaway/dundee">Dundee</Link>
                </li>
                <li>
                  <Link to="/takeaway/edinburgh">Edinburgh</Link>
                </li>
                <li>
                  <Link to="/takeaway/glasgow">Glasgow</Link>
                </li>
                <li>
                  <Link to="/takeaway/aberdeen">Aberdeen</Link>
                </li>
                <li>
                  <Link to="/takeaway/london">London</Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link to="/takeaway/birmingham">Birmingham</Link>
                </li>
                <li>
                  <Link to="/takeaway/cardiff">Cardiff</Link>
                </li>
                <li>
                  <Link to="/takeaway/leeds">Leeds</Link>
                </li>
                <li>
                  <Link to="/takeaway/manchester">Manchester</Link>
                </li>
                <li>
                  <Link to="/takeaway/swansea">Swansea</Link>
                </li>
              </ul>
            </div>
            <div className="top-cuisines sub-section">
              <h4>Top cuisines near you</h4>
              <ul>
                <li>
                  <Link to="/takeaway/nearme/chinese">Chinese</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/pizza">Pizza</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/indian">Indian</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/kebab">Kebab</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/chicken">Chicken</Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link to="/takeaway/nearme/english">English</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/sushi">Sushi</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/italian">Italian</Link>
                </li>
                <li>
                  <Link to="/takeaway/nearme/mexican">Mexican</Link>
                </li>
              </ul>
            </div>
          </div> */}
          <div className="sitemap-row">
            <div className="companies sub-section">
              <h4>Company</h4>
              <ul>
                <li>Helpdesk</li>
                <li>
                  <a href="/terms">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy</a>
                </li>
                <li>
                  <a href="/legal">Legal</a>
                </li>
              </ul>
            </div>
            <div className="apply sub-section">
              <div className="apply-content">
                <span>Want more info on getting your merchant featured on the app?</span>
                <img src={ShapeSvg} alt="shape" />
                <a href="/merchant-signup">Apply now</a>
              </div>
            </div>
          </div>
        </MainContainer>
      </SiteMapSection>
      <FooterSection>
        <MainContainer className="footer-bottom">
          <span>
            © Trade Sprint Limited. All rights reserved.<br></br>
            Trade Sprint and the Trade Sprint logo are the trade marks, and UK registered trade marks, of Trade Sprint Limited.
          </span>
        </MainContainer>
      </FooterSection>
    </div>
  );
};

const MainContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  margin: 0 auto;
  position: relative;
  justify-content: center;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  &.footer-bottom img {
    position: absolute;
    left: 0;
    top: 0;

    @media (max-width: 767px) {
      position: relative;
      left: auto;
      top: auto;
    }
  }

  &.footer-bottom span {
    @media (max-width: 1024px) {
      font-size: 10px;
    }

    @media (max-width: 767px) {
      margin-top: 15px;
    }
  }
`;

const SiteMapSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px 15px;
  background-color: #f8f8f8;

  @media (max-width: 1024px) {
    padding: 80px 42px;
  }

  @media (max-width: 767px) {
    padding: 60px 37px;
  }

  .sitemap-container {
    flex-direction: column;
  }

  .sitemap-row {
    width: 100%;
    margin: 0 auto;

    &:first-child {
      margin-bottom: 60px;
    }

    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .sub-section {
    width: 50%;
    float: left;

    @media (max-width: 767px) {
      width: 100%;
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      margin: 0 0 15px 0;
    }

    ul {
      padding: 0;
      float: left;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      list-style: none;
      li {
        a {
          color: #272848;
        }
      }
    }

    &.top-cities {
      ul {
        width: 30%;
      }
    }

    &.top-cuisines {
      ul {
        width: 50%;
      }

      @media (max-width: 767px) {
        margin-top: 30px;
      }
    }

    &.companies {
      width: 25%;

      @media (max-width: 767px) {
        width: 50%;
      }
    }

    &.apply {
      width: 290px;
      height: 115px;
      position: relative;

      @media (max-width: 767px) {
        margin-top: 30px;
      }

      .apply-content {
        border: 1px solid black;
        padding: 24px 20px;
        position: relative;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        background: white;
        z-index: 2;
        height: 100%;
      }

      &:after {
        content: '';
        width: 290px;
        height: 115px;
        position: absolute;
        top: 4px;
        left: 4px;
        border: 1px dashed #000;
        box-sizing: border-box;
        z-index: 1;
      }

      span {
        float: left;
        margin-bottom: 12px;
      }

      img {
        position: absolute;
        right 12px;
        top: 12px;
        padding: 6px;
      }

      a {
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
`;

const FooterSection = styled.div`
  display: flex;
  background-color: #f8f8f8;
  height: 70px;
  border-top: 1px solid ${CONSTANTS.BORDER_GREY_COLOR};
  padding: 0 80px;
  position: relative;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #505a5f;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 0 42px;
  }

  @media (max-width: 767px) {
    padding: 15px 37px;
    flex-direction: column;
    height: auto;
  }
`;

export default StoreFrontFooter;
