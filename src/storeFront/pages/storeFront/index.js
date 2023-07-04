import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as qs from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import get from 'lodash/get';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import StoreFrontMasterComponent from 'sharedComponents/StoreFrontMasterComponent';
import StoreFrontHeader from 'sharedComponents/StoreFrontHeader';
import Footer from 'sharedComponents/StoreFrontFooter';
import LineExpandibleDiv from './components/LineExpandibleDiv';
import ViewMapModal from './components/ViewMapModal';
import MenuNav from './components/MenuNav';
import MenuSection from './components/MenuSection';
import ConfirmPostcodeModal from './components/ConfirmPostcodeModal';
import { sortMenuData } from 'utils/sortMenu';
import { getOpeningTime } from 'utils/menu';
import { getStoreCloudImg } from 'utils/cloudImg';
import PreLoadSVG from 'svg/placeholder.svg';
import './styles.scss';

import * as CONSTANTS from 'constants/constants';
import * as types from '../../actions/actionTypes';

const StoreFrontPage = ({ history, match }) => {
  const dispatch = useDispatch();

  const [shwoViewMapModal, setShowViewMapModal] = useState(false);
  const { storeInfo, orderList } = useSelector((state) => ({
    storeInfo: state.storeFrontReducer.store,
    orderList: state.storeFrontReducer.orderList,
  }));

  const [showConfirmpostcodeModal, setShowConfirmPostcodeModal] =
    useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      const publicAddress = match.params.id;
      axios
        .get(`/store/menu2/${publicAddress}`)
        .then((res) => {
          if (res.data.success) {
            const storeData = { ...res.data.store };
            storeData.menu = {
              ...res.data.store.menus[0],
            };
            dispatch({
              type: types.STORE_FRONT_STORE_INFO,
              payload: storeData,
            });
          } else {
            history.push('/');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          history.push('/');
        });
    } else {
      dispatch({
        type: types.SET_POSTCODE_FOR_CHECKOUT,
        payload: '',
      });
    }
  }, []); // eslint-disable-line

  const setDeliveryType = () => {
    const filterData = qs.parse(history.location.search);
    if (filterData.postcode && filterData.fullfillment_type) {
      const storeName = match.params.id.replace(/-/g, ' ').replace(/\+/g, ' ');
      dispatch({
        type: types.UPDAGTE_DELIVERY_INFO,
        payload: {
          type: parseInt(filterData.fullfillment_type),
          postcode: filterData.postcode,
          storeName,
        },
      });
    } else if (match.params.id) {
      const storeName = match.params.id.replace(/-/g, ' ').replace(/\+/g, ' ');
      const fullFillmentTypeStr = get(localStorage, 'fullFillmentType', null);

      if (fullFillmentTypeStr === null) {
        dispatch({
          type: types.UPDAGTE_DELIVERY_INFO,
          payload: {
            type: storeInfo.fullfillment_type.delivery
              ? CONSTANTS.ORDER_TRANS_TYPE.DELIVERY
              : CONSTANTS.ORDER_TRANS_TYPE.COLLECTION,
            storeName,
          },
        });
        setShowConfirmPostcodeModal(true);
        return;
      }

      const fullFillmentType = JSON.parse(fullFillmentTypeStr);

      if (
        !fullFillmentType &&
        storeInfo.fullfillment_type.delivery &&
        storeInfo.fullfillment_type.pickup
      ) {
        dispatch({
          type: types.UPDAGTE_DELIVERY_INFO,
          payload: {
            type: storeInfo.fullfillment_type.delivery
              ? CONSTANTS.ORDER_TRANS_TYPE.DELIVERY
              : CONSTANTS.ORDER_TRANS_TYPE.COLLECTION,
            storeName,
          },
        });
      } else if (
        localStorage.fullFillmentType &&
        fullFillmentType.storeName === storeName
      ) {
        if (
          storeInfo.fullfillment_type.delivery &&
          storeInfo.fullfillment_type.pickup
        ) {
          dispatch({
            type: types.UPDAGTE_DELIVERY_INFO,
            payload: fullFillmentType,
          });
        } else if (
          fullFillmentType.type === CONSTANTS.ORDER_TRANS_TYPE.DELIVERY &&
          storeInfo.fullfillment_type.delivery
        ) {
          dispatch({
            type: types.UPDAGTE_DELIVERY_INFO,
            payload: fullFillmentType,
          });
        } else {
          dispatch({
            type: types.UPDAGTE_DELIVERY_INFO,
            payload: fullFillmentType,
          });
        }
      } else if (
        storeInfo.fullfillment_type.delivery &&
        storeInfo.fullfillment_type.pickup
      ) {
        dispatch({
          type: types.UPDAGTE_DELIVERY_INFO,
          payload: {
            type: storeInfo.fullfillment_type.delivery
              ? CONSTANTS.ORDER_TRANS_TYPE.DELIVERY
              : CONSTANTS.ORDER_TRANS_TYPE.COLLECTION,
            storeName,
          },
        });
      }

      if (get(fullFillmentType, 'postcode', '').length === 0)
        setShowConfirmPostcodeModal(true);
    }
  };

  useEffect(() => {
    if (Object.keys(storeInfo).length > 0 && get(storeInfo, 'id', -1) >= 0)
      setDeliveryType();
  }, [storeInfo]); // eslint-disable-line

  const getSortFilteredCategory = () => {
    const categories = get(storeInfo.menu, 'categories', []).filter(
      (category) => category.items && category.items.length > 0
    );
    return categories;
  };

  return (
    <StoreFrontMasterComponent>
      <StoreFrontHeader />

      <div style={{ backgroundColor: 'white' }}>
        <MainContainer id="storefront-top-container" className="pt-4">
          <Row>
            <Col id="store-front-left" lg="7">
              {loading ? (
                <Skeleton width="80%" height="150px" />
              ) : (
                <>
                  <h3 className="mb-4 store-title">
                    {get(storeInfo, 'name', '')}
                  </h3>
                  <p className="mb-2 store-open-time">
                    {`${getOpeningTime(storeInfo)} • Pickup, Delivery`}
                  </p>
                  <LineExpandibleDiv
                    lineLimit={2}
                    fontSize="13px"
                    lineHeight={21}
                    bgColor="transparent"
                    content={get(storeInfo, 'description', '')}
                  />

                  <p className="mt-3 mb-2">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="store-info-fontawesome mr-2"
                    />
                    {get(storeInfo, 'phone_number', '')}
                  </p>
                  <p className="mb-2">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="store-info-fontawesome mr-2"
                      onClick={() => {
                        setShowViewMapModal(true);
                      }}
                    />
                    {get(storeInfo, 'address', '')}
                  </p>
                </>
              )}
            </Col>
            <Col lg="5">
              <div id="delivery-div" className="align-items-center">
                {loading ? (
                  <Skeleton width="100%" height="150px" />
                ) : (
                  <div className="product-img-div">
                    <img
                      className="product-img"
                      src={
                        get(storeInfo, 'cover_img', '') === ''
                          ? PreLoadSVG
                          : getStoreCloudImg(
                              get(storeInfo, 'cover_img', ''),
                              'store',
                              503,
                              160,
                              ''
                            )
                      }
                      alt="product"
                    />
                  </div>
                )}

                <div className="d-flex mb-4"></div>
              </div>
            </Col>
          </Row>
          <ViewMapModal
            isShow={shwoViewMapModal}
            hideModal={() => {
              setShowViewMapModal(false);
            }}
          />
        </MainContainer>
      </div>

      {loading ? (
        <Skeleton height="56px" />
      ) : (
        <MenuNav categories={getSortFilteredCategory()} />
      )}

      <div id="store-body" className="d-flex store-body">
        <MainContainer>
          {loading ? (
            <div className="row mt-3 pt-4">
              <Col className="d-flex flex-column product-list" lg="8">
                <div>
                  <Skeleton
                    width="300px"
                    height="40px"
                    style={{ marginBottom: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    width: '100%',
                  }}
                >
                  <div height="152px" style={{ flex: '0 1 48%' }}>
                    <Skeleton width="100%" height="152px" />
                  </div>
                  <div height="152px" style={{ flex: '0 1 48%' }}>
                    <Skeleton width="100%" height="152px" />
                  </div>
                </div>
              </Col>
            </div>
          ) : (
            <MenuSection />
          )}
        </MainContainer>
      </div>
      <Footer />
      {orderList.length > 0 && <BottomSpacing />}
      <ConfirmPostcodeModal
        isShow={showConfirmpostcodeModal}
        hideModal={() => setShowConfirmPostcodeModal(false)}
        storeInfo={storeInfo}
      />
    </StoreFrontMasterComponent>
  );
};

const MainContainer = styled(Container)`
  max-width: 1280px;
`;

const BottomSpacing = styled.div`
  width: 100%;
  height: 85px;
  display: none;
  background: transparent;
  @media screen and (max-width: 767px) {
    display: block;
  }
`;

export default withRouter(StoreFrontPage);
