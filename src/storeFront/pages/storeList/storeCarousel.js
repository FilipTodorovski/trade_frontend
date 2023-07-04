import React, { useRef } from 'react';

import get from 'lodash/get';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getStoreCloudImg } from 'utils/cloudImg';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { ORDER_TRANS_TYPE } from 'constants/constants';
import PlaceHolderSVG from 'svg/placeholder.svg';

const StoreCarousel = ({
  history,
  stores,
  title,
  fullFillmentType,
  postcode,
}) => {
  const carouselRef = useRef();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <StoreContainer>
      <div className="d-flex align-items-center mb-3">
        <h5 className="title mb-0">{title}</h5>
        <Button
          className="btn-carousel-arrow mr-1 ml-auto ht-btn-outline-primary"
          variant="outline-primary"
          onClick={() => {
            carouselRef.current.previous();
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button
          className="btn-carousel-arrow mr-1 ht-btn-outline-primary"
          variant="outline-primary"
          onClick={() => {
            carouselRef.current.next();
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
      <Carousel
        responsive={responsive}
        ref={carouselRef}
        draggable={false}
        arrows={false}
      >
        {stores.map((item) => {
          return (
            <CustomCard
              key={item.id}
              onClick={() => {
                history.push(
                  `/${item.name}/menu?fullfillment_type=${fullFillmentType}&postcode=${postcode.value}`.replace(
                    / /g,
                    '+'
                  )
                );
              }}
            >
              <Card.Body>
                {get(item, 'cover_img', null) === null ? (
                  <img src={PlaceHolderSVG} alt="placeholder" />
                ) : (
                  <img
                    src={getStoreCloudImg(get(item, 'cover_img', ''), 'store')}
                    alt="cover"
                  />
                )}
              </Card.Body>
              <Card.Footer className="d-flex">
                <div className="content">
                  <h6>{item.name}</h6>
                  <p>{item.about}</p>
                </div>
                <div className="delivery-in text-primary">
                  {fullFillmentType === ORDER_TRANS_TYPE.DELIVERY &&
                    get(item, 'delivery_prep_time', 0)}
                  {fullFillmentType === ORDER_TRANS_TYPE.COLLECTION &&
                    get(item, 'pickup_prep_time', 0)}
                  <br />
                  mins
                </div>
              </Card.Footer>
            </CustomCard>
          );
        })}
      </Carousel>
    </StoreContainer>
  );
};

const StoreContainer = styled.div`
  margin-top: 1.5rem;

  .title {
    text-align: center;
    margin: 0;
    margin-bottom: 0;
    font-size: 1.5em;
    font-weight: bold;
  }

  .btn-carousel-arrow {
    width: 50px;
    height: 50px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 479px) {
      width: 40px;
      height: 40px;
    }
  }
`;

const CustomCard = styled(Card)`
  cursor: pointer;
  margin: 10px;

  &: hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  .card-body {
    position: relative;
    overflow: hidden;
    height: 150px;
    background-color: #e8ebeb;
    img {
      left: 50%;
      top: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      width: auto;
      height: 100%;
    }
    svg {
      left: 0;
      top: 0;
      position: absolute;
      width: 100%;
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    .store-logo {
      flex: 1 0 50px;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      overflow: hidden;
      margin-right: 1rem;
      background-color: #e8ebeb;

      img {
        width: 100%;
        height: 100%;
      }

      svg {
        width: 200%;
        height: 200%;
      }
    }

    .content {
      flex: 1 1 100%;
      overflow: hidden;

      h6 {
        margin-bottom: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #0b0c0c;
      }
      p {
        margin-bottom: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .delivery-in {
      background-color: rgba(116, 51, 255, 0.3);
      display: flex;
      height: 40px;
      border-radius: 15px;
      align-items: center;
      text-align: center;
      padding: 0 10px;
      flex: 1 0 auto;
      margin-left: 1rem;
      font-size: 0.8rem;
      line-height: 0.8rem;
      font-weight: bold;
    }
  }
`;

export default StoreCarousel;
