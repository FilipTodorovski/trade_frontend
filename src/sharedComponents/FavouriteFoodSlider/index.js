import React from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import Carousel from 'react-multi-carousel';
import ButtonGroup from 'sharedComponents/CarouselButtonGroup';

import { getAssetsCloudImage } from 'utils/cloudImg';

const FavrouiteFoodSlider = ({ wrapperStyle, responsive }) => {
  const history = useHistory();

  return (
    <ComponentContainer style={wrapperStyle}>
      <Carousel
        responsive={responsive}
        arrows={false}
        renderButtonGroupOutside
        infinite={true}
        customButtonGroup={<ButtonGroup />}
      >
        <div
          className="home-carousel"
          role="button"
          onClick={() => {
            history.push('/takeaway/nearme/italian');
          }}
        >
          <img
            src={getAssetsCloudImage('Slider-Italian-Food.jpg')}
            alt="Food1"
          />
          <h4>Italian food</h4>
        </div>
        <div
          className="home-carousel"
          onClick={() => {
            history.push('/takeaway/nearme/mexican');
          }}
          role="button"
        >
          <img
            src={getAssetsCloudImage('Slider-Mexican-Food.jpg')}
            alt="Food2"
          />
          <h4>Mexican food</h4>
        </div>
        <div
          className="home-carousel"
          onClick={() => {
            history.push('/takeaway/nearme/sush');
          }}
          role="button"
        >
          <img src={getAssetsCloudImage('Slider-Japan-Food.jpg')} alt="Food3" />
          <h4>Japanese food</h4>
        </div>
        <div
          className="home-carousel"
          onClick={() => {
            history.push('/takeaway/nearme/chinese');
          }}
          role="button"
        >
          <img
            src={getAssetsCloudImage('Slider-Chinese-Food.jpg')}
            alt="Food4"
          />
          <h4>Chinese food</h4>
        </div>
      </Carousel>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
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
      z-index: 1;
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
`;

export default FavrouiteFoodSlider;
