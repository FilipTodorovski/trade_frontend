import React from 'react';
import styled from 'styled-components';
import LeftArrowSvg from 'svg/left-arrow.svg';
import RightArrowSvg from 'svg/right-arrow.svg';

const ButtonGroup = ({ next, previous, ...rest }) => {
  const {
    carouselState: { currentSlide },
  } = rest;
  return (
    <CarouselButtonGroup>
      <PrevButton
        className={currentSlide === 0 ? 'disable' : ''}
        onClick={() => previous()}
      >
        <img src={LeftArrowSvg} alt="left arrow" />
      </PrevButton>
      <NextButton onClick={() => next()}>
        <img src={RightArrowSvg} alt="right arrow" />
      </NextButton>
    </CarouselButtonGroup>
  );
};

const CarouselButtonGroup = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 40px;
  width: 100%;
  margin: auto;

  @media (max-width: 767px) {
    top: auto;
    bottom: -30px;
    right: 37px;
    width: 120px;
  }
`;
const PrevButton = styled.button`
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    outline: none;
  }

  @media (max-width: 1024px) {
    margin-left: 10px;
  }
`;

const NextButton = styled.button`
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20px;
  top: 0;

  &:focus {
    outline: none;
  }

  @media (max-width: 1024px) {
    right: 10px;
  }
`;

export default ButtonGroup;
