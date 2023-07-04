import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import * as qs from 'query-string';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import get from 'lodash/get';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';

import StoreFrontMasterComponent from 'sharedComponents/StoreFrontMasterComponent';
import StoreFrontHeader from 'sharedComponents/StoreFrontHeader';
import StoreCarousel from './storeCarousel';
import { getLatLngFromPostcode } from 'utils/store';
import { ORDER_TRANS_TYPE } from 'constants/constants';
import { getStoreCloudImg } from 'utils/cloudImg';
import { checkStoreOpenNow } from 'utils/menu';

import { getNearbyStores } from 'Apis/Elastic';

import PlaceHolderSVG from 'svg/placeholder.svg';
import DeliverVanSVG from 'svg/delivery-van.svg';
import { getRegularPostCodeStr } from 'utils/address';

const StoreListPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [storeList, setStoreList] = useState([]);
  const [fullFillmentType, setFullFillmentType] = useState(
    ORDER_TRANS_TYPE.DELIVERY
  );
  const [postcode, setPostcode] = useState({
    value: '',
    validate: true,
    errorMsg: '',
  });

  const getMenuFromJoin = (joinData, storeId) => {
    const findOne = joinData.find((item) => item.store_id === storeId);
    if (findOne) return findOne.menu;
    else return null;
  };

  useEffect(() => {
    let unmounted = false;

    const filterData = qs.parse(history.location.search);

    const loadStoreList = async () => {
      setLoading(true);
      if (filterData.postcode.length > 0) {
        setPostcode({
          value: filterData.postcode.replace(/\+/g, ' '),
          validate: true,
          errorMsg: '',
        });

        const latLng = await getLatLngFromPostcode(filterData.postcode);

        const elasticStores = await getNearbyStores(
          getRegularPostCodeStr(filterData.postcode)
        );

        if (elasticStores.length > 0) {
          const radians = (degress) => {
            return degress * (Math.PI / 180);
          };

          const filteredStore = elasticStores.filter((item) => {
            const deliveryData = get(item, 'delivery_data', {});
            if (Object.keys(deliveryData).length === 0) return false;

            const itemLatLng = get(deliveryData, 'latLng', null);
            if (itemLatLng === null) return false;

            const deliveryZones = get(deliveryData, 'zones', []);
            if (deliveryZones.length === 0) return false;

            const maxDistance = Math.max.apply(
              Math,
              deliveryZones.map(function (a) {
                return parseFloat(a.radius);
              })
            );

            if (
              3959 *
                Math.acos(
                  Math.cos(radians(latLng.lat)) *
                    Math.cos(radians(itemLatLng.lat)) *
                    Math.cos(radians(latLng.lng) - radians(itemLatLng.lng)) +
                    Math.sin(radians(latLng.lat)) *
                      Math.sin(radians(itemLatLng.lat))
                ) <=
              maxDistance
            )
              return true;
            return false;
          });
          if (!unmounted) {
            const resMenus = await axios.post('menu/store/open_hours', {
              store_ids: filteredStore.map((item) => item.id),
            });
            if (resMenus && resMenus.data.success)
              setStoreList([
                ...filteredStore.map((item) => {
                  return {
                    ...item,
                    menu: getMenuFromJoin(resMenus.data.join_data, item.id),
                  };
                }),
              ]);
            setLoading(false);
          }
        } else {
          axios
            .post('/store/nearby', {
              latitude: latLng.lat,
              longitude: latLng.lng,
            })
            .then((res) => {
              if (res.data.success) {
                if (!unmounted) setStoreList([...res.data.stores]);
              } else {
                if (!unmounted) setStoreList([]);
              }
              if (!unmounted) setLoading(false);
            })
            .catch((err) => {
              if (!unmounted) {
                setStoreList([]);
                setLoading(false);
              }
            });
        }
      }
    };

    loadStoreList();
    return () => {
      unmounted = true;
    };
  }, []); // eslint-disable-line

  const getFilteredStores = (isOpen) => {
    const filteredStores = storeList.filter((item) => {
      if (fullFillmentType === ORDER_TRANS_TYPE.DELIVERY) {
        const checkOpenStatus = checkStoreOpenNow(item);
        if (item.fullfillment_type.delivery) {
          if (isOpen) {
            return checkOpenStatus && parseInt(item.online_status) === 0;
          } else {
            return !(checkOpenStatus && parseInt(item.online_status) === 0);
          }
        } else {
          return false;
        }
      }
      if (fullFillmentType === ORDER_TRANS_TYPE.COLLECTION) {
        const checkOpenStatus = checkStoreOpenNow(item);
        if (item.fullfillment_type.pickup) {
          if (isOpen) {
            return checkOpenStatus && parseInt(item.online_status) === 0;
          } else {
            return !(checkOpenStatus && parseInt(item.online_status) === 0);
          }
        } else {
          return false;
        }
      }

      return false;
    });
    return filteredStores;
  };

  // const clickSearch = () => {
  //   if (postcode.value.length === 0) {
  //     setPostcode({
  //       ...postcode,
  //       validate: false,
  //       errorMsg: 'Please input postcode.',
  //     });
  //     return;
  //   }

  //   if (postcodeValidator(postcode.value, 'UK')) {
  //     history.push({
  //       pathname: '/store/list',
  //       search: `?postcode=${postcode.value}`,
  //     });

  //     axios
  //       .get(`/store/search/postcode/${postcode.value}`)
  //       .then((res) => {
  //         if (res.data.success) {
  //           setStoreList([...res.data.stores]);
  //         } else setStoreList([...res.data.stores]);
  //       })
  //       .catch((err) => {
  //         setStoreList([]);
  //       });
  //   } else {
  //     setPostcode({
  //       ...postcode,
  //       validate: false,
  //       errorMsg:
  //         'Sorry we did not recognise that postcode, check and try again',
  //     });
  //   }
  // };

  return (
    <StoreFrontMasterComponent>
      <StoreFrontHeader />
      <FullFillmentContainer>
        <button
          type="button"
          className={`btn-pickup btn border-right ${
            fullFillmentType === ORDER_TRANS_TYPE.DELIVERY ? 'selected' : ''
          }`}
          onClick={() => {
            setFullFillmentType(ORDER_TRANS_TYPE.DELIVERY);
          }}
        >
          <img
            className="deliver-van-icon"
            src={DeliverVanSVG}
            alt="delivery van"
          />
          Delivery
        </button>
        <button
          type="button"
          className={`btn-delivery btn ${
            fullFillmentType === ORDER_TRANS_TYPE.COLLECTION ? 'selected' : ''
          }`}
          onClick={() => {
            setFullFillmentType(ORDER_TRANS_TYPE.COLLECTION);
          }}
        >
          <FontAwesomeIcon icon={faMale} className="mr-2" />
          Collection
        </button>
      </FullFillmentContainer>
      <MainContainer className="flex-column">
        <OpenStoreContainer>
          <h5 className="title">Store Open & Online</h5>
          {loading ? (
            <>
              <div style={{ flex: '0 1 calc(33.33% - 20px)', margin: '10px' }}>
                <Skeleton width="100%" height="215px" />
              </div>
              <div style={{ flex: '0 1 calc(33.33% - 20px)', margin: '10px' }}>
                <Skeleton width="100%" height="215px" />
              </div>
              <div style={{ flex: '0 1 calc(33.33% - 20px)', margin: '10px' }}>
                <Skeleton width="100%" height="215px" />
              </div>
            </>
          ) : (
            <>
              {getFilteredStores(true).map((item) => {
                return (
                  <CustomCard
                    key={item.id}
                    onClick={() => {
                      history.push(
                        `/${item.public_address}/menu?fullfillment_type=${fullFillmentType}&postcode=${postcode.value}`.replace(
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
                          src={getStoreCloudImg(
                            get(item, 'cover_img', ''),
                            'store',
                            411,
                            150,
                            ''
                          )}
                          alt="cover"
                        />
                      )}
                    </Card.Body>
                    <Card.Footer className="d-flex">
                      <div className="content">
                        <h6>{item.name}</h6>
                        <p>{item.description}</p>
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
            </>
          )}
        </OpenStoreContainer>

        {loading ? (
          <OpenStoreContainer>
            <h5 className="title mb-0">Store closed and Offline</h5>
            <div style={{ flex: '0 1 calc(33.33% - 20px)', margin: '10px' }}>
              <Skeleton width="100%" height="215px" />
            </div>
            <div style={{ flex: '0 1 calc(33.33% - 20px)', margin: '10px' }}>
              <Skeleton width="100%" height="215px" />
            </div>
            <div style={{ flex: '0 1 calc(33.33% - 20px)', margin: '10px' }}>
              <Skeleton width="100%" height="215px" />
            </div>
          </OpenStoreContainer>
        ) : (
          <React.Fragment>
            {fullFillmentType === ORDER_TRANS_TYPE.DELIVERY && (
              <StoreCarousel
                loading={loading}
                history={history}
                stores={getFilteredStores(false)}
                title="Store closed and Offline"
                fullFillmentType={fullFillmentType}
                postcode={postcode}
              />
            )}
            {fullFillmentType === ORDER_TRANS_TYPE.COLLECTION && (
              <StoreCarousel
                loading={loading}
                history={history}
                stores={getFilteredStores(false)}
                title="Store closed and Offline"
                fullFillmentType={fullFillmentType}
                postcode={postcode}
              />
            )}
          </React.Fragment>
        )}
      </MainContainer>
    </StoreFrontMasterComponent>
  );
};

const MainContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  margin: 0 auto;
  align-items: stretch;
  @media screen and (max-width: 767px) {
    overflow-x: hidden;
    margin-left: 0;
    margin-right: 0;
  }
`;

const FullFillmentContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;
  width: 100%;

  .btn {
    border: 1px solid #213f5e;
    box-shadow: none !important;
    outline: none !important;
    border: none;
    background: none;
    font-size: 20px;
    color: #0b0c0c;
    font-weight: bold;

    &.selected {
      color: #213f5e;
    }
  }

  .btn-pickup {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btn-delivery {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .deliver-van-icon {
    width: 24px;
    margin-right: 5px;
  }
`;

const OpenStoreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1.5rem -10px 1rem;

  .title {
    text-align: left;
    margin: 0 10px 0;
    font-size: 1.5em;
    font-weight: bold;
    flex: 1 0 calc(100% - 20px);
  }
`;

const CustomCard = styled(Card)`
  cursor: pointer;
  margin: 10px;
  flex: 0 1 calc(33.33% - 20px);

  @media screen and (max-width: 767px) {
    flex: 0 1 calc(50% - 20px);
  }

  @media screen and (max-width: 479px) {
    flex: 0 1 100%;
  }

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

export default StoreListPage;
