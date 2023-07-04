import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import styled from 'styled-components';
import { Container, Card, Button } from 'react-bootstrap';
import LogoSVG from 'svg/logo-menu.svg';
import PlaceHolderSVG from 'svg/placeholder.svg';
import * as CONSTANTS from 'constants/constants';

const DeliverToMePage = ({ history }) => {
  const [storeList, setStoreList] = useState([]);
  const [fullFillmentType, setFullFillmentType] = useState(
    CONSTANTS.FULLFILLMENT_DELIVERY
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      axios
        .post('/store2/nearby', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          // latitude: 56.4617751,
          // longitude: -2.9687003,
        })
        .then((res) => {
          if (res.data.success) setStoreList([...res.data.stores]);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  // const getStoreSectinCount = (fullFillmentTypeOne, isOpen) => {
  //   return storeList.filter(
  //     (item) =>
  //       // item.fullFillment_type[fullFillmentTypeOne.toLowerCase()] &&
  //       //   isOpen &&
  //       //   checkStoreIsOpen(item);
  //       item.fullFillment_type[fullFillmentTypeOne.toLowerCase()]
  //   ).length;
  // };

  // const checkStoreIsOpen = (storeInfoOne) => {
  //   return true;
  // };

  return (
    <Container>
      <TopBar className="border-bottom">
        <div className="logo-svg">
          <img src={LogoSVG} alt="logo" />
        </div>
        <Button
          variant="outline-primary"
          className="mr-3 ml-auto"
          onClick={() => {
            history.push('/login');
          }}
        >
          Log in
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => {
            history.push('/register');
          }}
        >
          Sign up
        </Button>
      </TopBar>
      <FUllFillmentContainer>
        <button
          className={`btn-pickup btn ${
            fullFillmentType === CONSTANTS.FULLFILLMENT_PICKUP
              ? 'btn-primary'
              : ''
          }`}
          onClick={() => {
            setFullFillmentType(CONSTANTS.FULLFILLMENT_PICKUP);
          }}
        >
          {CONSTANTS.FULLFILLMENT_PICKUP}
        </button>
        <button
          className={`btn-delivery btn ${
            fullFillmentType === CONSTANTS.FULLFILLMENT_DELIVERY
              ? 'btn-primary'
              : ''
          }`}
          onClick={() => {
            setFullFillmentType(CONSTANTS.FULLFILLMENT_DELIVERY);
          }}
        >
          {CONSTANTS.FULLFILLMENT_DELIVERY}
        </button>
      </FUllFillmentContainer>
      <StoreContainer>
        {storeList.map((item) => {
          return (
            <StoreCard
              key={item.id}
              onClick={() => {
                history.push(`/${item.name}/menu`);
              }}
            >
              <div className="cover-img">
                <img
                  src={
                    _.get(item, 'cover_img', '') === ''
                      ? PlaceHolderSVG
                      : item.cover_img
                  }
                  alt="cover"
                />
              </div>
              <div className="store-info">
                <div className="content">
                  <p className="mb-0">{item.name}</p>
                  <p className="mb-0 description">{item.about}</p>
                </div>
                <div className="delivery-in text-primary">
                  10 - 25
                  <br />
                  mins
                </div>
              </div>
            </StoreCard>
          );
        })}
      </StoreContainer>
    </Container>
  );
};

const TopBar = styled.div`
  display: flex;
  padding: 1rem 0;
  align-items: center;
  .logo-svg {
    svg {
      height: 40px;
    }
  }
`;

const FUllFillmentContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6 !important;

  .btn {
    border: 1px solid #213f5e;
    box-shadow: none !important;
    outline: none !important;
  }

  .btn-pickup {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btn-delivery {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const StoreContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  margin-top: 4rem;
`;

const StoreCard = styled(Card)`
  flex: 0 1 30%;
  margin-bottom: 2rem;
  margin-left: 5%;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  &:nth-child(3n + 1) {
    margin-left: 0;
  }

  .cover-img {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e8ebeb;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .store-info {
    display: flex;
    padding: 1rem;

    .content {
      flex: 1 1 100%;
      overflow: hidden;
      .description {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .delivery-in {
      background-color: rgba(116, 51, 255, 0.3);
      display: flex;
      align-items: center;
      text-align: center;
      border-radius: 0.5rem;
      padding: 0 10px;
      flex: 1 0 auto;
      margin-left: 1rem;
      font-size: 0.8rem;
      line-height: 0.8rem;
    }
  }
`;

export default withRouter(connect(null, {})(DeliverToMePage));
