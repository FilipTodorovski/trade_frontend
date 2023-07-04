import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import moment from 'moment';
import get from 'lodash/get';
import useSound from 'use-sound';
import AppContainer from 'admin/components/AppContainer';
import TopSectionSelector from './components/TopSectionSelector';
import OrderHeader from './components/OrderHeader';
import OrderCard from './components/OrderCard';
import NewOrderAlert from './components/NewOrderAlert';
import HtSpinner from 'admin/components/HtSpinner';
import CompletedOrderSection from './components/CompletedOrderSection';
import { RunToast } from 'utils/toast';
import { printOrder } from 'utils/print';
import newOrderSound from 'sounds/neworder_notification.mp3';
import {
  ORDER_STATUS,
  ORDER_TRANS_TYPE,
  ORDER_TAB_TITLE,
  getToken,
  getPusherOrderChannel,
  getOrderStatus,
} from 'constants/constants';
import * as types from '../../actions/actionTypes';
import ApiService from 'admin/ApiService';
import { filterOrders as filterOrderElasticApi, getStores } from 'Apis/Elastic';
import { deletelUnreadOrderApi } from 'Apis/AdminApis';

const OrderPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({});
  const [orderCount, setOrderCount] = useState([0, 0, 0, 0, 0]);
  const [selectedSection, setSelection] = useState(ORDER_TAB_TITLE.NEW);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).subtract(1, 'days').startOf('day'),
    endDate: moment(new Date()).endOf('day'),
  });
  const [searchStr, setSearchStr] = useState('');

  const { storeId, userInfo } = useSelector((state) => ({
    storeId: state.orderReducer.storeId,
    userInfo: state.userReducer.user,
  }));

  const [storeList, setStoreList] = useState([]);

  const [play] = useSound(newOrderSound);
  const soundRef = useRef(null);

  useEffect(() => {
    let unmounted = false;
    setLoading(true);

    // get storelist for the store menu
    if (userInfo.id >= 0)
      getStores(userInfo.id).then((res) => {
        if (!unmounted) {
          setLoading(false);
          if (res.length > 0) {
            dispatch({
              type: types.ORDER_STORE_ID,
              payload: res[0].id,
            });
          }

          setStoreList([...res]);
        }
      });

    return () => {
      dispatch({
        type: types.ORDER_STORE_ID,
        payload: -1,
      });
      unmounted = true;
    };
  }, [userInfo.id]); // eslint-disable-line

  const deleteUnreadOrder = () => {
    if (get(userInfo, 'id', -1) >= 0 && storeId > 0) {
      deletelUnreadOrderApi(storeId)
        .then((res) => {
          dispatch({
            type: types.DELETE_UNREAD_ORDER,
            payload: storeId,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    let unmounted = false;

    const userId = get(userInfo, 'id', -1).toString();
    if (storeId >= 0 && userId >= 0) {
      const channel = getPusherOrderChannel();
      channel.connection.bind(userId.toString(), function (data) {
        if (Number(storeId) === Number(data.order.store_id)) {
          if (soundRef && soundRef.current) soundRef.current.click();
          dispatch({
            type: types.NEW_ORDER_COME,
            payload: 1,
          });
          // new order is not selected store
          if (storeId !== data.order.store_id)
            dispatch({
              type: types.ADD_UNREAD_ORDER,
              payload: {
                store_id: data.order.store_id,
                order_id: data.order.id,
              },
            });
          if (!unmounted) {
            setNewOrder(data.order);
            setShowNewOrderAlert(true);
          }
        }
      });
      return () => {
        channel.unbind(`${userId}`);
        unmounted = true;
      };
    }
  }, [storeId, userInfo, soundRef]); // eslint-disable-line

  useEffect(() => {
    let unmounted = false;
    if (get(newOrder, 'id', -1) >= 0 && showNewOrderAlert) {
      if (!unmounted) {
        setOrders([newOrder, ...orders]);
        setNewOrder({});
        const orderCountTemp = [...orderCount];
        orderCountTemp[0] += 1;
        setOrderCount([...orderCountTemp]);
      }
    }
    return () => {
      unmounted = true;
    };
  }, [showNewOrderAlert]); // eslint-disable-line

  const filterOrders = () => {
    if (storeId !== -1) {
      setOrderLoading(true);
      setOrders([]);

      const filter_option = {
        status: getOrderStatus(selectedSection),
        store_id: storeId,
      };

      if (selectedSection === ORDER_TAB_TITLE.COMPLETED) {
        filter_option.start = dateRange.startDate.startOf('day').valueOf();
        filter_option.end = dateRange.endDate.endOf('day').valueOf();
      }
      filterOrderElasticApi(filter_option)
        .then((resOrder) => {
          if (resOrder.length > 0) {
            if (searchStr) {
              const filteredOrder = resOrder.filter((item) => {
                if (
                  item.dataValues.order_number.toString().indexOf(searchStr) >=
                  0
                )
                  return true;
                const updatedAtStr = `${moment(item.updatedAt).format(
                  'Do MMM, YYYY'
                )} at ${moment(item.dataValues.updatedAt).format('hh:mm')}`;
                if (updatedAtStr.indexOf(searchStr) >= 0) return true;

                if (item.dataValues.status === 1) {
                  if ('delivered'.indexOf(searchStr) >= 0) return true;
                } else if (item.dataValues.status === 2) {
                  if ('picked up'.indexOf(searchStr) >= 0) return true;
                }
                return false;
              });
              setOrders([...filteredOrder]);
            } else setOrders([...resOrder]);
            // filter_option.search_str = searchStr;
          } else setOrders([]);
          setOrderLoading(false);
        })
        .catch((err) => {
          console.log('Elastic filter order failed.');
          console.log(err);
          setOrders([]);
          setOrderLoading(false);
        });
    }
  };

  useEffect(() => {
    let unmounted = false;
    if (storeList.length > 0) {
      filterOrders();
      if (!unmounted) {
        setShowNewOrderAlert(false);
      }
    }
    return () => {
      unmounted = true;
    };
  }, [storeId, selectedSection, dateRange, storeList]); // eslint-disable-line

  const updateOrderCount = (status) => {
    const statusTemp = [...orderCount];
    if (status === ORDER_STATUS.REJECTED) {
      statusTemp[0] -= 1;
    } else {
      statusTemp[status - 1] -= 1;
      statusTemp[status] += 1;
    }
    setOrderCount([...statusTemp]);
  };

  const updateOrderStatus = (status, selectedOrderInfo) => {
    let successStr = '';
    let failedStr = '';
    switch (status) {
      case ORDER_STATUS.ACCEPTED:
        successStr = 'accepted.';
        failedStr = 'accept failed.';
        break;
      case ORDER_STATUS.REJECTED:
        successStr = 'rejected.';
        failedStr = 'reject failed.';
        break;
      case ORDER_STATUS.READY:
        successStr = 'prepared.';
        failedStr = 'prepare failed.';
        break;
      case ORDER_STATUS.DELIVERY_PICKUP:
        if (selectedOrderInfo.trans_type === ORDER_TRANS_TYPE.DELIVERY) {
          successStr = 'deliveried.';
          failedStr = 'delivery failed.';
        } else if (
          selectedOrderInfo.trans_type === ORDER_TRANS_TYPE.COLLECTION
        ) {
          successStr = 'pickuped.';
          failedStr = 'pickup failed.';
        }
        break;
      case ORDER_STATUS.COMPLETED:
        successStr = 'completed.';
        failedStr = 'complete failed.';
        break;
      default:
        successStr = 'accepted.';
        failedStr = 'accept failed.';
        break;
    }

    const updateDate = { status };
    if (status === ORDER_STATUS.ACCEPTED) {
      updateDate.delivery_time = selectedOrderInfo.delivery_time;
    }

    setLoading(true);
    ApiService({
      method: 'PUT',
      url: `/order/status/${selectedOrderInfo.id}`,
      data: { ...updateDate },
      headers: getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          setOrders([
            ...orders.filter((item) => item.id !== selectedOrderInfo.id),
          ]);
          updateOrderCount(status);
          RunToast(
            'success',
            `Order ${selectedOrderInfo.order_number} ${successStr}`
          );
        }

        // call print api
        if (status === ORDER_STATUS.ACCEPTED) {
          printOrder(selectedOrderInfo);
        }

        if (
          status === ORDER_STATUS.ACCEPTED ||
          status === ORDER_STATUS.REJECTED
        ) {
          dispatch({
            type: types.NEW_ORDER_COME,
            payload: -1,
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        setLoading(false);
        RunToast(
          'error',
          `Order ${selectedOrderInfo.order_number} ${failedStr}`
        );
      });
  };

  const acceptOrder = (order) => {
    updateOrderStatus(ORDER_STATUS.ACCEPTED, order);
    deleteUnreadOrder();
  };

  const rejectOrder = (orderInfo) => {
    updateOrderStatus(ORDER_STATUS.REJECTED, orderInfo);
    deleteUnreadOrder();
  };

  const renderOrderException = () => {
    if (orders && orders.length > 0) return null;
    let title = '';
    let subTitle = '';
    switch (selectedSection) {
      case ORDER_TAB_TITLE.NEW:
        title = 'No new orders for you.';
        subTitle = 'We will alert you once a new order arrives';
        break;
      case ORDER_TAB_TITLE.PREPARING:
        title = "You're not currently preparing any orders.";
        subTitle = 'Once you move an order from accepted it will show here.';
        break;
      case ORDER_TAB_TITLE.READY:
        title = 'There are no orders currently ready.';
        subTitle = 'Only orders move from pending to ready will show here.';
        break;
      case ORDER_TAB_TITLE.DELIVERY_PICKUP:
        title =
          'There are no orders marked as out for delivery / ready for collection';
        subTitle = 'Once you move an order from ready it will show here.';
        break;
      case ORDER_TAB_TITLE.COMPLETED:
        title = 'We are currently waiting for your first order.';
        subTitle =
          "Once it's moved through the order process it will show here.";
        break;
      default:
        title = "We don't have any orders for you.";
        subTitle = 'We will inform you once a new order is coming.';
        break;
    }

    if (selectedSection !== ORDER_TAB_TITLE.COMPLETED) {
      return (
        <EmptyOrderContainer>
          {orderLoading ? (
            <h4>Loading...</h4>
          ) : (
            <>
              <h4>{title}</h4>
              <span>{subTitle}</span>
            </>
          )}
        </EmptyOrderContainer>
      );
    }
  };

  return (
    <AppContainer>
      <OrderContainer
        style={{ paddingBottom: showNewOrderAlert ? '240px' : '40px' }}
      >
        <TopSectionSelector
          curSection={selectedSection}
          setCurSection={(sectionId) => {
            setSelection(sectionId);
          }}
          storeId={storeId}
          orderCount={orderCount}
          setOrderCount={setOrderCount}
        />
        <OrderViewContainer>
          {selectedSection === ORDER_TAB_TITLE.COMPLETED ? (
            <CompletedOrderSection
              storeId={storeId}
              setStoreId={(newStoreId) => {
                dispatch({
                  type: types.ORDER_STORE_ID,
                  payload: newStoreId,
                });
              }}
              storeList={storeList}
              orders={orders}
              searchStr={searchStr}
              setSearchStr={(val) => setSearchStr(val)}
              dateRange={dateRange}
              changeRange={(range) => {
                setDateRange({ ...range });
              }}
              finishEditSearch={filterOrders}
              refundOrder={(newValue) => {
                setOrders([
                  ...orders.map((item) => {
                    if (newValue.id === item.id) return newValue;
                    return item;
                  }),
                ]);
              }}
            />
          ) : (
            <>
              <OrderHeader
                curSection={selectedSection}
                setLoading={(isLoading) => setLoading(isLoading)}
                storeId={storeId}
                setStoreId={(newStoreId) => {
                  dispatch({
                    type: types.ORDER_STORE_ID,
                    payload: newStoreId,
                  });
                }}
                storeList={storeList}
              />

              <OrderListContainer>
                {orders.length > 0 &&
                  orders.map((order) => {
                    return (
                      <OrderCard
                        key={order.order_number}
                        curSection={selectedSection}
                        orderInfo={order}
                        storeList={storeList}
                        acceptOrder={acceptOrder}
                        rejectOrder={rejectOrder}
                        readyOrder={(orderInfo) =>
                          updateOrderStatus(ORDER_STATUS.READY, orderInfo)
                        }
                        deliverPickOrder={(orderInfo) =>
                          updateOrderStatus(
                            ORDER_STATUS.DELIVERY_PICKUP,
                            orderInfo
                          )
                        }
                        completeOrder={(orderInfo) =>
                          updateOrderStatus(ORDER_STATUS.COMPLETED, orderInfo)
                        }
                      />
                    );
                  })}
                {renderOrderException()}
              </OrderListContainer>
            </>
          )}
        </OrderViewContainer>
      </OrderContainer>
      {showNewOrderAlert && (
        <NewOrderAlert onHide={() => setShowNewOrderAlert(false)} />
      )}
      {loading && <HtSpinner />}
      <button
        onClick={() => {
          play();
        }}
        ref={soundRef}
        style={{ display: 'none' }}
      ></button>
    </AppContainer>
  );
};

const OrderContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const OrderViewContainer = styled(Container)`
  margin-top: 60px;
  padding: 0 31px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const OrderListContainer = styled(Container)`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const EmptyOrderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;

  h4 {
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

export default OrderPage;
