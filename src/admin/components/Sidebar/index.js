import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import get from 'lodash/get';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { RunToast } from 'utils/toast';
import LogoSVGWhite from 'svg/logowhite.svg';
import LogoMenuSVG from 'svg/logo-small.svg';
import newOrderSound from '../../../sounds/neworder_notification.mp3';
import {
  NEW_ORDER_COME,
  LOGIN_SUCCESS,
  SET_UNREAD_ORDER,
  ADD_UNREAD_ORDER,
} from '../../actions/actionTypes';
import { getUnreadOrderApi } from 'Apis/AdminApis';
import { getNewOrderCount } from 'Apis/Elastic';
import {
  getPusherOrderChannel,
  getPusherPayoutChannel,
} from 'constants/constants';

function useStateAndRef(initial) {
  const [value, setValue] = useState(initial);
  const valueRef = useRef(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);
  const soundRef = useRef(null);
  const [canPlay, setCanPlay, refCanPlay] = useStateAndRef(false);
  const [newOrderCount, setNewOrderCount, refNewOrderCount] = useStateAndRef(0);

  const { newOrderCnt, userInfo, unreadOrder } = useSelector((state) => ({
    newOrderCnt: state.orderReducer.newOrderCount,
    unreadOrder: state.orderReducer.unreadOrder,
    userInfo: state.userReducer.user,
  }));

  const [mobileMenu, setMobileMenu] = useState('');
  const [alertInterval, setAlertInterval] = useState(null);
  const [alertNewInterval, setAlertNewInterval] = useState(null);

  const getUserToken = async (userId) => {
    try {
      const newOrderCount = await getNewOrderCount(userId);
      setNewOrderCount(newOrderCount)
    } catch (err) {
    }
  };

  useEffect(() => {
    return () => {
      if (alertInterval !== null) {
        clearInterval(alertInterval);
      }
      if (alertNewInterval !== null) {
        clearInterval(alertNewInterval);
      }
      document.removeEventListener("mousemove", playSound);
    };
  }, []); // eslint-disable-line

  const playSound = () => {
    setCanPlay((canPlay)=>{
      canPlay = true;
      return canPlay
    })
  };

  useEffect(() => {
      if (alertInterval) {
        clearInterval(alertInterval);
      }
      const intervalId = setInterval(() => {
        if (refCanPlay.current && refNewOrderCount.current) {
          if (soundRef && soundRef.current) {
            soundRef.current.muted = false;
            soundRef.current.play();
          }
        }
        const userId = get(userInfo, 'id', -1).toString();
        if (userId > 0) {
          getUserToken(userId);
        }
      }, 5000);
      setAlertInterval(intervalId);
  }, [])

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      document.addEventListener("mousemove", playSound);
    }
    
  }, [unreadOrder, newOrderCount, newOrderCnt]); // eslint-disable-line

  useEffect(() => {
    const userId = get(userInfo, 'id', -1).toString();
    if (userId > 0) {
      getUnreadOrderApi()
        .then((res) => {
          dispatch({
            type: SET_UNREAD_ORDER,
            payload: res.data.orders,
          });
        })
        .catch((err) => {});       
  
        getUserToken(userId);
    }

  }, [userInfo, newOrderCnt]); // eslint-disable-line

  useEffect(() => {
    const userId = get(userInfo, 'id', -1).toString();
    if (
      userId >= 0 &&
      soundRef &&
      soundRef.current &&
      location.pathname !== '/orders'
    ) {
      const orderChannel = getPusherOrderChannel();
      orderChannel.connection.bind(userId.toString(), function (data) {
        if (soundRef && soundRef.current) soundRef.current.click();
        dispatch({
          type: NEW_ORDER_COME,
          payload: 1,
        });
        dispatch({
          type: ADD_UNREAD_ORDER,
          payload: {
            store_id: data.order.store_id,
            order_id: data.order.id,
          },
        });
      });
      return () => orderChannel.unbind(`${userId}`);
    }
  }, [userInfo, soundRef]); // eslint-disable-line

  useEffect(() => {
    const userId = get(userInfo, 'id', -1).toString();
    if (userId >= 0 && soundRef && soundRef.current) {
      const payoutChannel = getPusherPayoutChannel();
      payoutChannel.connection.bind(userId.toString(), function (data) {
        if (soundRef && soundRef.current) soundRef.current.click();

        RunToast('success', `Payout updated`);
      });
      return () => payoutChannel.unbind(`${userId}`);
    }
  }, [userInfo, soundRef]);

  const handleHamburgerMenu = (e) => {
    e.preventDefault();
    setMobileMenu(mobileMenu === '' ? 'mobile-menu' : '');
  };

  return (
    <div className="ht-sidebar">
      <div className="header-wrapper">
        <div className="logo-svg">
          <img className="desktop" src={LogoSVGWhite} alt="logo white" />
          <img className="tablet" src={LogoMenuSVG} alt="logo" />
        </div>
        <div className="mobile-nav">
          <a href="#" onClick={handleHamburgerMenu}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </a>
        </div>
      </div>
      <div className={`sidebar-content ${mobileMenu}`}>
        <Navbar>
          <Nav>
            <Nav.Item
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              <Nav.Link as={Link} to="/dashboard">
                <svg
                  className="fill dashboard"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 0C3.57849 0 0 3.57849 0 8C0 12.4215 3.57849 16 8 16C12.4215 16 16 12.4215 16 8C16 3.57849 12.4215 0 8 0ZM7.31183 2.61505C7.31183 2.23656 7.62151 1.92688 8 1.92688C8.3785 1.92688 8.68817 2.23656 8.68817 2.61505V3.42366C8.68817 3.80215 8.3785 4.11183 8 4.11183C7.62151 4.11183 7.31183 3.80215 7.31183 3.42366V2.61505ZM3.40645 8.68817H2.59785C2.21935 8.68817 1.90968 8.3785 1.90968 8C1.90968 7.62151 2.21935 7.31183 2.59785 7.31183H3.40645C3.78495 7.31183 4.09462 7.62151 4.09462 8C4.09462 8.3785 3.78495 8.68817 3.40645 8.68817ZM5.24731 5.23011C4.97204 5.50538 4.54194 5.50538 4.26667 5.24731L3.69892 4.66237C3.42366 4.3871 3.42366 3.95699 3.69892 3.68172C3.97419 3.40645 4.4043 3.40645 4.67957 3.68172L5.24731 4.24946C5.52258 4.52473 5.52258 4.95484 5.24731 5.23011ZM8.87742 9.82366C8.60215 9.96129 8.30968 10.0129 8 10.0129C6.7957 10.0129 5.84946 8.96344 6.0043 7.72473C6.09032 7.10538 6.45161 6.55484 7.00215 6.24516C7.6043 5.90108 8.29247 5.90108 8.86022 6.17634L11.3376 3.69892C11.6129 3.42366 12.043 3.42366 12.3183 3.69892C12.5935 3.97419 12.5935 4.4043 12.3183 4.67957L9.82366 7.13979C10.3054 8.13763 9.87527 9.34194 8.87742 9.82366ZM13.3849 8.68817H12.5763C12.1979 8.68817 11.8882 8.3785 11.8882 8C11.8882 7.62151 12.1979 7.31183 12.5763 7.31183H13.3849C13.7634 7.31183 14.0731 7.62151 14.0731 8C14.0731 8.3785 13.7634 8.68817 13.3849 8.68817Z" />
                </svg>
                <span>Dashboard</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={location.pathname === '/orders' ? 'active' : ''}
            >
              <Nav.Link as={Link} to="/orders">
                <svg
                  className="fill order"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.7 15.3V11.9H4.5747L5.18925 13.13C5.33375 13.4181 5.62785 13.6 5.95 13.6H11.05C11.3721 13.6 11.6663 13.4181 11.8108 13.13L12.4253 11.9H15.3V15.3H1.7ZM16.15 0.85C16.3755 0.85 16.5917 0.939553 16.7511 1.09895C16.9104 1.25836 17 1.47457 17 1.7V16.15C17 16.3755 16.9104 16.5917 16.7511 16.7511C16.5917 16.9104 16.3755 17 16.15 17H0.85C0.624566 17 0.408365 16.9104 0.24896 16.7511C0.0895533 16.5917 0 16.3755 0 16.15V1.7C0 1.47457 0.0895533 1.25836 0.24896 1.09895C0.408365 0.939553 0.624566 0.85 0.85 0.85H4.25C4.47543 0.85 4.69164 0.939553 4.85105 1.09895C5.01044 1.25836 5.1 1.47457 5.1 1.7C5.1 1.92543 5.01044 2.14164 4.85105 2.30105C4.69164 2.46044 4.47543 2.55 4.25 2.55H1.7V10.2H5.1C5.42215 10.2 5.71625 10.3819 5.86075 10.6701L6.4753 11.9H10.5247L11.1392 10.6701C11.2838 10.3819 11.5778 10.2 11.9 10.2H15.3V2.55H12.75C12.5245 2.55 12.3083 2.46044 12.1489 2.30105C11.9896 2.14164 11.9 1.92543 11.9 1.7C11.9 1.47457 11.9896 1.25836 12.1489 1.09895C12.3083 0.939553 12.5245 0.85 12.75 0.85H16.15ZM5.34905 5.70095C5.27013 5.62203 5.20754 5.52835 5.16482 5.42523C5.12211 5.32212 5.10013 5.21161 5.10013 5.1C5.10013 4.9884 5.12211 4.87788 5.16482 4.77477C5.20754 4.67165 5.27013 4.57797 5.34905 4.49905C5.42797 4.42013 5.52165 4.35754 5.62477 4.31482C5.72788 4.27211 5.8384 4.25013 5.95 4.25013C6.0616 4.25013 6.17212 4.27211 6.27523 4.31482C6.37835 4.35754 6.47203 4.42013 6.55095 4.49905L7.65 5.5981V0.85C7.65 0.624566 7.73956 0.408365 7.89895 0.24896C8.05836 0.0895533 8.27457 0 8.5 0C8.72543 0 8.94164 0.0895533 9.10105 0.24896C9.26044 0.408365 9.35 0.624566 9.35 0.85V5.5981L10.449 4.49905C10.528 4.42013 10.6217 4.35754 10.7248 4.31482C10.8278 4.27211 10.9384 4.25013 11.05 4.25013C11.1616 4.25013 11.2722 4.27211 11.3752 4.31482C11.4783 4.35754 11.572 4.42013 11.651 4.49905C11.7299 4.57797 11.7925 4.67165 11.8352 4.77477C11.8779 4.87788 11.8999 4.9884 11.8999 5.1C11.8999 5.21161 11.8779 5.32212 11.8352 5.42523C11.7925 5.52835 11.7299 5.62203 11.651 5.70095L9.10095 8.25095C9.0222 8.33016 8.92856 8.39302 8.82542 8.43591C8.7223 8.4788 8.6117 8.50088 8.5 8.50088C8.3883 8.50088 8.2777 8.4788 8.17458 8.43591C8.07144 8.39302 7.9778 8.33016 7.89905 8.25095L5.34905 5.70095Z"
                  />
                </svg>
                <span>Orders</span>
                {newOrderCount > 0 && (
                  <span className="notify-span">{newOrderCount}</span>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={location.pathname === '/stores' ? 'active' : ''}
            >
              <Nav.Link as={Link} to="/stores">
                <svg
                  className="fill store"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.6 6.8C12.6624 6.8 11.9 6.03755 11.9 5.1H15.3C15.3 6.03755 14.5375 6.8 13.6 6.8ZM13.6 11.9H3.4V8.5C4.41405 8.5 5.32695 8.05375 5.95 7.34655C6.57305 8.05375 7.48595 8.5 8.5 8.5C9.51405 8.5 10.4269 8.05375 11.05 7.34655C11.673 8.05375 12.5859 8.5 13.6 8.5V11.9ZM10.812 15.3H6.188C6.4923 14.7033 6.64445 14.0811 6.7218 13.6H10.2782C10.3547 14.0811 10.5077 14.7033 10.8112 15.3H10.812ZM10.2 5.1C10.2 6.03755 9.43755 6.8 8.5 6.8C7.56245 6.8 6.8 6.03755 6.8 5.1H10.2ZM1.7 5.1H5.1C5.1 6.03755 4.33755 6.8 3.4 6.8C2.46245 6.8 1.7 6.03755 1.7 5.1ZM3.0753 1.7H13.9247L14.7747 3.4H2.2253L3.0753 1.7ZM16.9108 3.87005L15.2107 0.47005C15.0662 0.18105 14.773 0 14.45 0H2.55C2.227 0 1.93375 0.1819 1.78925 0.47005L0.08925 3.87005C0.02975 3.9865 0 4.11825 0 4.25V5.1C0 6.3529 0.6885 7.4375 1.7 8.0274V12.75C1.7 13.2192 2.07995 13.6 2.55 13.6H4.9895C4.8569 14.235 4.55855 15.045 3.87005 15.3892C3.5173 15.5661 3.332 15.9613 3.4221 16.3455C3.5139 16.728 3.8556 17 4.25 17H12.75C13.1444 17 13.4861 16.728 13.5779 16.3455C13.668 15.9613 13.4827 15.5661 13.13 15.3892C12.45 15.0493 12.1499 14.2367 12.0139 13.6H14.45C14.9201 13.6 15.3 13.2192 15.3 12.75V8.0274C16.3115 7.4375 17 6.3529 17 5.1V4.25C17 4.11825 16.9694 3.9865 16.9108 3.87005Z" />
                </svg>
                <span>Stores</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={
                location.pathname.indexOf('menus') >= 0 ? 'active' : ''
              }
            >
              <Nav.Link as={Link} to="/menus/overview">
                <svg
                  className="fill menu"
                  width="15"
                  height="18"
                  viewBox="0 0 15 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.4231 2.25H12.6923V0.5625C12.6923 0.252 12.4338 0 12.1154 0H1.73077C0.776538 0 0 0.757125 0 1.6875V15.75C0 16.9909 1.035 18 2.30769 18H14.4231C14.7415 18 15 17.748 15 17.4375V2.8125C15 2.502 14.7415 2.25 14.4231 2.25ZM10.9615 14.625H4.03846C3.72 14.625 3.46154 14.373 3.46154 14.0625C3.46154 13.752 3.72 13.5 4.03846 13.5H10.9615C11.28 13.5 11.5385 13.752 11.5385 14.0625C11.5385 14.373 11.28 14.625 10.9615 14.625ZM3.46154 6.75C3.46154 5.48775 4.22192 4.5 5.19231 4.5C6.16269 4.5 6.92308 5.48775 6.92308 6.75C6.92308 7.74563 6.44654 8.5635 5.76923 8.86613V11.8125C5.76923 12.123 5.51077 12.375 5.19231 12.375C4.87385 12.375 4.61538 12.123 4.61538 11.8125V8.86613C3.93808 8.5635 3.46154 7.74563 3.46154 6.75ZM11.5385 9.5625C11.5385 9.873 11.28 10.125 10.9615 10.125H9.23077V11.8125C9.23077 12.123 8.97231 12.375 8.65385 12.375C8.33538 12.375 8.07692 12.123 8.07692 11.8125V5.0625C8.07692 4.752 8.33538 4.5 8.65385 4.5C10.245 4.5 11.5385 5.76225 11.5385 7.3125V9.5625ZM11.5385 2.25H1.73077C1.41231 2.25 1.15385 1.998 1.15385 1.6875C1.15385 1.377 1.41231 1.125 1.73077 1.125H11.5385V2.25Z" />
                </svg>
                <span>Products</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={`${
                location.pathname === '/settings' ? 'active' : ''
              } mt-auto`}
            >
              <Nav.Link as={Link} to="/settings">
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to=""
                onClick={() => {
                  dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                      user: {},
                      token: '',
                    },
                  });
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log out</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>

        <video muted autoPlay ref={soundRef}>
          <source src={newOrderSound} />
        </video>
      </div>
    </div>
  );
};

export default Sidebar;
