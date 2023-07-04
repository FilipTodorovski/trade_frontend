import React, { useState, useEffect, memo } from 'react';

import styled from 'styled-components';
import { getBackImageOfFoodType } from 'utils/cloudImg';

const FoodTypeBannerImg = ({ foodType }) => {
  const [originImg, setOriginImg] = useState('');
  useEffect(() => {
    setOriginImg(getBackImageOfFoodType(foodType));
  }, [foodType]);

  return (
    <BannerImg>
      <picture>
        <source
          media="(min-width: 1601px)"
          srcSet={`${originImg}?w=900&h=900&func=crop`}
        ></source>
        <source
          media="(max-width: 1600px)"
          srcSet={`${originImg}?w=800&h=800&func=crop`}
        ></source>
        <source
          media="(max-width: 1440px)"
          srcSet={`${originImg}?w=700&h=700&func=crop`}
        ></source>
        <source
          media="(max-width: 1279px)"
          srcSet={`${originImg}?w=800&h=800&func=crop`}
        ></source>
        <source
          media="(max-width: 1199px)"
          srcSet={`${originImg}?w=700&h=700&func=crop`}
        ></source>
        <source
          media="(max-width: 1023px)"
          srcSet={`${originImg}?w=1024&h=1024&func=crop`}
        ></source>
        <source
          media="(max-width: 480px)"
          srcSet={`${originImg}?w=600&h=600&func=crop`}
        ></source>
        <img src={originImg} alt="food type" />
      </picture>
    </BannerImg>
  );
};

const BannerImg = styled.div`
  overflow: visible;
  padding-left: 93px;

  img {
    width: 900px;
    height: 900px;
    border-radius: 450px;
    margin: 0;

    @media (max-width: 1600px) {
      width: 800px;
      height: 800px;
      border-radius: 400px;
    }

    @media (max-width: 1440px) {
      width: 700px;
      height: 700px;
      border-radius: 350px;
    }

    @media (max-width: 1279px) {
      width: 800px;
      height: 800px;
      margin: 0;
      border-radius: 400px;
    }

    @media (max-width: 1199px) {
      width: 700px;
      height: 700px;
      margin: 0;
      border-radius: 350px;
    }
  }

  @media (max-width: 1023px) {
    margin: 20px 0 0 0;
    height: 200px;
    img {
      margin: 0;
      width: 1024px;
      height: 1024px;
      border-radius: 512px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 480px) {
    height: 150px;
    img {
      margin: 0;
      width: 600px;
      height: 600px;
      border-radius: 300px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export default memo(FoodTypeBannerImg);
