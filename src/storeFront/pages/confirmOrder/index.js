import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import moment from 'moment';
import get from 'lodash/get';
import axios from 'axios';
import styled from 'styled-components';
import { Container, Card } from 'react-bootstrap';
import HtSpinner from 'admin/components/HtSpinner';
import StoreFrontMasterComponent from 'sharedComponents/StoreFrontMasterComponent';
import StoreFrontHeader from 'sharedComponents/StoreFrontHeader';
import Footer from 'sharedComponents/StoreFrontFooter';
import { getOrderedProductPrice, getOrderListTotalPrice } from 'utils/order';
import { getStoreCloudImg } from 'utils/cloudImg';
import {
  ORDER_STATUS,
  PRIMARY_GREY_COLOR,
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_DARK_COLOR,
  PRIMARY_RED_COLOR,
  PRIMARY_RED_BACK_COLOR,
  ORDER_TRANS_TYPE,
  getPusherOrderChannel,
} from 'constants/constants';

import CircleCheckSvg from 'assets/images/circle-check.svg';
import LocationSvg from 'assets/images/location-black.svg';
import NoteSvg from 'assets/images/note.svg';

const ConfirmOrder = () => {
  const history = useHistory();
  const { menuId, confirmId } = useParams();
  const [loading, setLoading] = useState(true);
  const [confirmData, setConfirmData] = useState({});

  useEffect(() => {
    let unmounted = false;

    axios
      .get(`/order/confirminfo/${menuId}/${confirmId}`)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          if (!unmounted)
            setConfirmData({
              order: { ...res.data.order },
              store: { ...res.data.store },
            });
        }
      })
      .catch((err) => {
        if (!unmounted) setLoading(false);
        history.push('/');
      });

    return () => {
      unmounted = true;
    };
  }, [menuId, confirmId]); // eslint-disable-line

  useEffect(() => {
    const orderId = get(confirmData, 'order.id', '');
    if (!!orderId) {
      const pusherChannel = getPusherOrderChannel();
      pusherChannel.connection.bind(`order-update-${orderId}`, function (data) {
        setConfirmData({
          ...confirmData,
          order: data.order,
        });
      });
    }
  }, [get(confirmData, 'order.order_number', '')]); // eslint-disable-line

  const getOrderStatusText = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return '';

    if (
      order.status === ORDER_STATUS.PENDING ||
      order.status === ORDER_STATUS.ACCEPTED ||
      order.status === ORDER_STATUS.READY
    )
      return (
        <>
          <h3>ESTIMATED DELIVERY TIME</h3>
          <h1>{getDeliverTime()}</h1>
        </>
      );
    else if (order.status === ORDER_STATUS.COMPLETED) {
      const updatedTime = get(order, 'updatedAt', null);
      return (
        <>
          <h3>{`ORDER ${
            order.trans_type === ORDER_TRANS_TYPE.DELIVERY
              ? 'DELIVERED'
              : order.trans_type === ORDER_TRANS_TYPE.COLLECTION
              ? 'COLLECTED'
              : ''
          }`}</h3>
          <h1>{moment(updatedTime).format('HH:mm')}</h1>
        </>
      );
    } else if (
      order.status === ORDER_STATUS.REJECTED ||
      order.status === ORDER_STATUS.REFUNDED
    ) {
      const updatedTime = get(order, 'updatedAt', null);
      return (
        <>
          <h3 style={{ color: PRIMARY_RED_COLOR }}>
            {order.status === ORDER_STATUS.REJECTED
              ? 'ORDER REJECTED'
              : 'ORDER REFUNDED'}
          </h3>
          <h1
            style={{
              color: PRIMARY_RED_COLOR,
              backgroundColor: PRIMARY_RED_BACK_COLOR,
            }}
          >
            {moment(updatedTime).format('HH:mm')}
          </h1>
        </>
      );
    }
  };

  const getDeliverTime = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return '';
    const deliverTime = get(order, 'delivery_time', null);
    if (!deliverTime) return '';
    return moment(deliverTime).format('HH:mm');
  };

  const getCustomerName = () => {
    const order = get(confirmData, 'order', null);

    if (!order) return '';

    return `${get(order, 'first_name', null)} ${get(order, 'last_name', null)}`;
  };

  const getDeliveryAddress = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return '';
    const address = get(order, 'address', null);
    const strArr = address.split(', ');

    if (strArr.length > 2) {
      const firstStr = [];
      const secondStr = [];
      strArr.forEach((item, nIndex) => {
        if (nIndex < strArr.length / 2) firstStr.push(item);
        else secondStr.push(item);
      });

      return (
        <p className="delivery-address">
          {firstStr.join(', ')}
          <br />
          {secondStr.join(', ')}
        </p>
      );
    }

    return <p className="delivery-address">{address}</p>;
  };

  const getOrderNotes = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return '';
    return get(order, 'customer_request', '');
  };

  const getStoreName = () => {
    const store = get(confirmData, 'store', null);
    if (!store) return '';
    return get(store, 'name', '');
  };

  const getStoreAddress = () => {
    const store = get(confirmData, 'store', null);
    if (!store) return '';
    return get(store, 'address', '');
  };

  const getPhoneNumber = () => {
    const store = get(confirmData, 'store', null);
    if (!store) return '';
    return get(store, 'phone_number', '');
  };

  const getStoreImg = () => {
    const store = get(confirmData, 'store', null);
    if (!store) return '';
    return getStoreCloudImg(get(store, 'cover_img', ''), 'store', 197, 191, '');
  };

  const getOrderlist = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return [];
    return get(order, 'items', []);
  };

  const getDevlierFee = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return 0.0;
    return get(order, 'delivery_fee', 0.0);
  };

  const getPaymentMethod = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return '';
    return get(order, 'payment_method', '');
  };

  const getOrderNumber = () => {
    const order = get(confirmData, 'order', null);
    if (!order) return '';
    return get(order, 'order_number', '');
  };

  const renderGroupItem = (item) => {
    if (item.items && item.items.length > 0) {
      const names = item.items.map((itemOne) => {
        if (itemOne.qty && itemOne.qty > 1)
          return `${itemOne.name} x ${itemOne.qty}`;
        else return itemOne.name;
      });
      return (
        <p style={{ color: PRIMARY_GREY_COLOR, margin: 0 }}>
          {names.join(', ')}
        </p>
      );
    }
    return null;
  };

  return (
    <StoreFrontMasterComponent>
      <ComponentContainer>
        <StoreFrontHeader />
        <MainContainer>
          {loading ? (
            <HtSpinner />
          ) : (
            <>
              <EstimateCard className="ht-card">
                {getOrderStatusText()}
              </EstimateCard>
              <StoreCard className="ht-card">
                <div
                  className="store-img"
                  style={{ backgroundImage: `url(${getStoreImg()})` }}
                ></div>
                <div className="store-right-section">
                  <div className="store-info">
                    <h1>{getStoreName()}</h1>
                    <h4>{getStoreAddress()}</h4>
                    <a href={`tel:${getPhoneNumber()}`}>
                      <b>{getPhoneNumber()}</b>
                    </a>
                  </div>
                  <div className="need-help">
                    <h4>NEED HELP?</h4>
                    <a
                      href={`tel:${getPhoneNumber()}`}
                      className="ht-btn-primary btn-call-store"
                    >
                      CALL STORE
                    </a>
                  </div>
                </div>
              </StoreCard>
              <PanelContainer>
                <LeftPanel>
                  <OrderSummary className="ht-card">
                    <CardHeader className="summary-header" style={{}}>
                      <img
                        src={CircleCheckSvg}
                        alt="circle check"
                        style={{ marginRight: '25px' }}
                      />
                      ORDER SUMMARY
                    </CardHeader>
                    <div className="content">
                      <h4>ORDER: {getOrderNumber()}</h4>
                      <div className="order-content">
                        {getOrderlist().map((item, idx) => {
                          return (
                            <div className="product-line" key={idx}>
                              <span>{`${item.qty}x`}&nbsp;</span>
                              <div className="product-name">
                                {item.name}
                                {renderGroupItem(item)}
                              </div>
                              <span style={{ marginLeft: 'auto' }}>
                                £
                                {Number(getOrderedProductPrice(item)).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          );
                        })}
                        <hr />
                        <div className="total-value">
                          <span>
                            <b>SUBTOTAL</b>
                          </span>
                          <span style={{ marginLeft: 'auto' }}>
                            <b>
                              £
                              {Number(
                                getOrderListTotalPrice(null, getOrderlist())
                              ).toFixed(2)}
                            </b>
                          </span>
                        </div>
                        <div className="total-value">
                          <span>Delivery Fee</span>
                          <span style={{ marginLeft: 'auto' }}>
                            £{getDevlierFee()}
                          </span>
                        </div>
                        <h3 className="total-pay-title">
                          TOTAL PAID BY {getPaymentMethod()}
                        </h3>
                        <h1 className="total-price">
                          £
                          {Number(
                            getOrderListTotalPrice(null, getOrderlist()) +
                              getDevlierFee()
                          ).toFixed(2)}
                        </h1>
                      </div>
                    </div>
                  </OrderSummary>
                </LeftPanel>
                <RightPanel>
                  <DeliveryDetails className="ht-card">
                    <CardHeader>
                      <img
                        src={LocationSvg}
                        alt="location"
                        style={{ marginRight: '17px' }}
                      />
                      DELIVERY DETAILS
                    </CardHeader>
                    <CardBody>
                      <h4>{getCustomerName()}</h4>
                      {getDeliveryAddress()}
                    </CardBody>
                  </DeliveryDetails>
                  <OrderNotes className="ht-card">
                    <CardHeader>
                      <img
                        src={NoteSvg}
                        alt="location"
                        style={{ marginRight: '17px' }}
                      />
                      ORDER NOTES
                    </CardHeader>
                    <CardBody>
                      <p className="order-notes">{getOrderNotes()}</p>
                    </CardBody>
                  </OrderNotes>
                </RightPanel>
              </PanelContainer>
            </>
          )}
        </MainContainer>
        <Footer />
      </ComponentContainer>
    </StoreFrontMasterComponent>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #f6f1ff;
  min-height: 100vh;
`;

const MainContainer = styled(Container)`
  max-width: 1071px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 219px;
  @media screen and (max-width: 999px) {
    margin-bottom: 30px;
  }
`;

const EstimateCard = styled(Card)`
  padding: 20px;
  width: 100%;
  max-width: 550px;
  height: 180px;
  align-items: center;
  align-self: center;
  margin: 50px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  h3 {
    font-size: 24px;
    margin: 0 0 20px 0;
    font-weight: 600;
    @media screen and (max-width: 480px) {
      font-size: 22px;
    }
  }
  h1 {
    background: rgba(241, 246, 255, 1);
    border-radius: 12px;
    color: ${PRIMARY_ACTIVE_COLOR};
    width: 206px;
    height: 73px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    font-weight: 600;
    margin: 0;
    @media screen and (max-width: 480px) {
      font-size: 35px;
      width: 156px;
      height: 53px;
    }
  }

  @media screen and (max-width: 480px) {
    height: auto;
  }
`;

const StoreCard = styled(Card)`
  margin: 59px 0 0 0;
  min-height: 254px;
  padding: 30px 44px;
  flex-direction: row;

  .store-img {
    flex: 0 0 198px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .store-right-section {
    flex: 1 1 100%;
    display: flex;
    .store-info {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      margin: 0 31px 0 48px;
      h1 {
        font-size: 34px;
        font-weight: 600;
        line-height: 41px;
      }
      h4 {
        font-size: 20px;
        line-height: 24px;
        margin: 9px 0 0 0;
      }
      a {
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;
        margin: 9px 0 0 0;
        color: ${PRIMARY_DARK_COLOR};
      }
    }

    .need-help {
      flex: 0 0 307px;
      background: rgba(241, 246, 255, 1);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h4 {
        font-weight: bold;
        font-size: 20px;
        margin: 0 0 20px 0;
      }
      .btn-call-store {
        width: 173px;
        height: 50px;
        cursor: pointer;
        color: white;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        text-decoration: none;
      }
    }
  }

  @media screen and (max-width: 999px) {
    .store-right-section {
      flex-direction: column;
      .store-info {
        margin-right: 0;
      }
      .need-help {
        flex: 1 1 auto;
        margin: 20px 0 0 0;
        flex-direction: row;
        justify-content: flex-start;
        background: none;
        margin-left: 48px;
        h4 {
          margin: 0 20px 0 0;
        }
      }
    }
    margin: 20px 0 0 0;
  }

  @media screen and (max-width: 767px) {
    flex-direction: column;
    .store-right-section {
      .store-info {
        margin: 20px 0 0 0;
      }
      .need-help {
        margin-left: 0;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .store-right-section {
      .store-info {
        h1 {
          font-size: 24px;
          line-height: 30px;
        }
        h4,
        a {
          font-size: 18px;
        }
      }
      .need-help {
        flex-direction: column;
        h4 {
          margin-bottom: 20px;
        }
      }
    }
  }
`;

const PanelContainer = styled.div`
  display: flex;
  margin: 49px 0 0 0;
  @media screen and (max-width: 999px) {
    flex-direction: column;
    margin: 20px 0 0 0;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 34px;
  width: 550px;
  @media screen and (max-width: 999px) {
    width: 100%;
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 34px;
  width: 428px;
  @media screen and (max-width: 999px) {
    width: 100%;
    margin: 20px 0 0 0;
  }
`;

const OrderSummary = styled(Card)`
  padding-bottom: 50px;
  min-height: 550px;
  height: auto;
  .content {
    margin: 20px 0 0 110px;
    display: flex;
    flex-direction: column;
    h4 {
      margin-bottom: 35px;
      font-weight: bold;
    }
  }
  .order-content {
    width: 255px;
    display: flex;
    flex-direction: column;
    .product-name {
      margin-right: 10px;
    }
    .total-pay-title {
      margin: 39px 0 0 0;
      text-transform: uppercase;
      font-size: 24px;
      text-align: center;
    }
    .total-price {
      font-weight: bold;
      font-size: 35px;
      line-height: 42px;
      margin: 11px 0 0 0;
      text-align: center;
    }
  }

  .product-line {
    display: flex;
    margin-bottom: 13px;
  }

  hr {
    border-top: 1px solid #e4e4e4;
    margin: 0 0 7px 0;
  }
  .total-value {
    display: flex;
    margin: 13px 0 0 0;
  }

  .summary-header {
    justify-content: flex-start;
    img {
      margin-right: 25px;
    }
  }

  @media screen and (max-width: 999px) {
    min-height: auto;

    .summary-header {
      justify-content: center;
      img {
        margin-right: 25px;
      }
    }
    .content {
      margin: 20px auto 0;
    }
  }

  @media screen and (max-width: 480px) {
    .content {
      h4 {
        font-size: 18px;
        margin-bottom: 10px;
      }
    }
    .order-content {
      .total-pay-title {
        margin: 20px 0 0 0;
        font-size: 18px;
      }
      .total-price {
        font-size: 24px;
      }
    }
    padding-bottom: 20px;
  }
`;

const DeliveryDetails = styled(Card)`
  height: 254px;

  @media screen and (max-width: 999px) {
    height: auto;
  }
`;

const OrderNotes = styled(Card)`
  height: 254px;
  margin: 49px 0 0 0;
  @media screen and (max-width: 999px) {
    height: auto;
    margin: 20px 0 0 0;
  }
`;

const CardHeader = styled.div`
  height: 75px;
  border-bottom: 1px solid #e4e4e4;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 42px;
  @media screen and (max-width: 480px) {
    padding: 0 20px;
    font-size: 20px;
    line-height: 25px;
    height: 50px;
    img {
      width: 30px;
      height: 30px;
      margin-right: 15px !important;
    }
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 21px 57px;
  h4 {
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
  }
  .delivery-address {
    margin: 11px 0 0 0;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
  }
  .order-notes {
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    textoverflow: ellipsis;
  }
`;

export default ConfirmOrder;
