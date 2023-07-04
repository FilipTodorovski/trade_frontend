import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import moment from 'moment';
import styled from 'styled-components';
import { Container, Dropdown, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import AppContainer from '../../../../components/AppContainer';
import DateRange from 'admin/components/DateRange';
import DotSpan from 'sharedComponents/DotSpan';
import ApiService from 'admin/ApiService';
import {
  getToken,
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_DARK_COLOR,
  STRIPE_PAYMENT_METHOD_TYPES,
  STRIPE_PAYMENT_STATUS,
} from 'constants/constants';

const TransactionHistory = () => {
  const history = useHistory();
  const [payoutTransactions, setPayoutTransactions] = useState([]);
  const [allPayoutTransactions, setAllPayoutTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).startOf('day'),
    endDate: moment(new Date()).startOf('day'),
  });
  const itemsPerPage = 10;
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchPaymentList = async () => {
      const response = await ApiService({
        method: 'GET',
        url: `/stripe/payments`,
        ...getToken(),
      });

      const items = response.data.data;
      setPayoutTransactions(items);
      setAllPayoutTransactions(items);
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
      setLoading(false);
    };

    fetchPaymentList();
  }, []);

  useEffect(() => {
    if (payoutTransactions.length === 0) return;

    rebuildPage(payoutTransactions, itemOffset);
  }, [payoutTransactions, itemOffset]);

  useEffect(() => {
    if (status === '') {
      setPayoutTransactions(allPayoutTransactions);
      return;
    }

    const filteredTransactions = allPayoutTransactions.filter(
      (transaction) => transaction.status === status
    );
    setPayoutTransactions(filteredTransactions);
    setItemOffset(0);
  }, [status]);

  const getSign = (amount) => {
    if (amount >= 0) return 'positive';
    return 'negative';
  };

  const rebuildPage = (payoutTransactions, itemOffset) => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(payoutTransactions.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(payoutTransactions.length / itemsPerPage));
  };

  const getAmount = (amount) => {
    return parseFloat(amount / 100).toFixed(2);
  };

  const handleClickRow = (item) => {
    history.push({
      pathname: '/settings/payment/transaction/detail',
      state: { ...item },
    });
  };

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % payoutTransactions.length;
    setItemOffset(newOffset);
  };

  return (
    <AppContainer>
      <MenuContainer>
        <TopHeader>
          <h1>Payouts</h1>
        </TopHeader>
        <FilterContainer>
          <CustomDropDown>
            <DropdownToggle variant="outline-secondary">
              {type || 'Any type'}
            </DropdownToggle>
            <DropdownMenu>
              {STRIPE_PAYMENT_METHOD_TYPES.map((item) => {
                return (
                  <DropdownItem
                    className={`${type === item.value ? 'active' : ''}`}
                  >
                    <div
                      className="menu-item"
                      onClick={() => {
                        type !== item.value ? setType(item.value) : setType('');
                      }}
                    >
                      {type === item.value && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                      {item.label}
                    </div>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </CustomDropDown>
          <CustomDateRanger>
            <DateRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={(d) => {
                setDateRange({ ...d });
              }}
              ranges={{
                Today: [moment(), moment()],
                Yesterday: [
                  moment().subtract(1, 'days'),
                  moment().subtract(1, 'days'),
                ],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
                'Last Month': [
                  moment().subtract(1, 'month').startOf('month'),
                  moment().subtract(1, 'month').endOf('month'),
                ],
              }}
            />
          </CustomDateRanger>
          <CustomDropDown>
            <DropdownToggle variant="outline-secondary">
              {status || 'Any status'}
            </DropdownToggle>
            <DropdownMenu>
              {STRIPE_PAYMENT_STATUS.map((item) => {
                return (
                  <DropdownItem
                    className={`${status === item.value ? 'active' : ''}`}
                  >
                    <div
                      className="menu-item"
                      onClick={() => {
                        status !== item.value
                          ? setStatus(item.value)
                          : setStatus('');
                      }}
                    >
                      {status === item.value && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                      {item.label}
                    </div>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </CustomDropDown>
        </FilterContainer>
        <TableContainer>
          <HistoryTable striped bordered responsive>
            <thead>
              <tr>
                <th>Status</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Fees</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      height: '150px',
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                <>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          height: '150px',
                        }}
                      >
                        There is no transaction history.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {currentItems.map((item, nIndex) => {
                        return (
                          <tr
                            className="table-row"
                            key={nIndex}
                            onClick={() => handleClickRow(item)}
                          >
                            <td key="status">
                              <div className="d-flex align-items-center">
                                <DotSpan status={item.status} />
                                {item.status}
                              </div>
                            </td>
                            <td key="reference">{item.id}</td>
                            <td key="data initiated">
                              {moment(item.created * 1000).format(
                                'MMM DD, YYYY, hh:mm'
                              )}
                            </td>
                            <td key="amount">
                              <AmountSpan sign={getSign(item.amount)}>
                                {`£${getAmount(item.amount)}`}
                              </AmountSpan>
                            </td>
                            <td key="fees">{`£${getAmount(
                              item.application_fee_amount
                            )}`}</td>
                            <td key="net">
                              {`£${getAmount(
                                item.amount - item.application_fee_amount
                              )}`}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </tbody>
          </HistoryTable>
        </TableContainer>
        <TransactionPagination>
          <ReactPaginate
            initialPage={0}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            previousLabel="‹"
            nextLabel="›"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
            disabledClassName="disabled"
          />
        </TransactionPagination>
      </MenuContainer>
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  max-width: 1280px;

  .status-selector {
    margin: 40px 0 0 0;
    width: 100%;
    max-width: 400px;
  }
`;

const TopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-contents: space-around;
  h1 {
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    margin: 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;

  .dropdown {
    margin-right: 20px;
  }
`;

const TableContainer = styled.div`
  overflow-y: auto;
  margin-top: 10px;
  font-size: 16px;

  .table-row {
    cursor: pointer;

    &:hover {
      background-color: rgba(241, 246, 255, 1);
    }
  }
`;

const HistoryTable = styled(Table)`
  tbody {
    tr {
      height: 50px;
    }
  }
`;

const TransactionPagination = styled.div`
  display: flex;
  margin: 20px 0 0 0;
  justify-content: center;
  .pagination {
    border-radius: 0;
    disabled: {
      opacity: 0.7;
      cursor: auto;
    }
  }

  .page-item {
    border-radius: 0;
    .page-link {
      border-radius: 0;
    }
    &.active {
      .page-link {
        color: ${PRIMARY_ACTIVE_COLOR};
        background-color: rgba(241, 246, 255, 1);
        font-weight: 600;
      }
    }
    :nth-child(2) {
      a {
        font-size: 17px;
      }
    }
    &:nth-last-child(2) {
      a {
        font-size: 17px;
      }
    }
    &.disabled {
      a {
        color: rgba(41, 45, 50, 0.7);
      }
    }
  }
  .first-item {
    font-size: 30px;
    line-height: 42px;
    padding: 0 1rem;
    color: #292d32;
    background: #fff;
    margin-bottom: 1rem;
    cursor: pointer;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border: 1px solid #dee2e6;
    border-right: 0;
    &: hover {
      background-color: #e9ecef;
      border-color: #dee2e6;
    }
    &.disabled {
      cursor: default;
      color: rgba(41, 45, 50, 0.7);
      background-color: white !important;
    }
  }
  .last-item {
    font-size: 30px;
    line-height: 42px;
    padding: 0 1rem;
    color: #292d32;
    background: #fff;
    margin-bottom: 1rem;
    cursor: pointer;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid #dee2e6;
    border-left: 0;
    &: hover {
      background-color: #e9ecef;
      border-color: #dee2e6;
    }
    &.disabled {
      cursor: default;
      color: rgba(41, 45, 50, 0.7);
      background-color: white !important;
    }
  }
`;

const CustomDropDown = styled(Dropdown)`
  margin: 20px 0 0 0;
`;

const DropdownMenu = styled(Dropdown.Menu)`
  border-radius: 12px;
  max-height: 217px;
  overflow-y: auto;
  .dropdown-item {
    &:active {
      color: ${PRIMARY_DARK_COLOR};
      background-color: rgba(241, 246, 255, 1);
    }
  }
`;

const DropdownItem = styled(Dropdown.Item)`
  display: flex;
  padding: 0;

  .menu-item {
    padding: 10px 15px 10px 25px;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    color: ${PRIMARY_DARK_COLOR};
    position: relative;
    display: flex;
    align-items: center;
    .fa-check {
      position: absolute;
      left: 7px;
    }
  }

  &.active {
    .menu-item {
      background-color: ${PRIMARY_ACTIVE_COLOR};
      color: white;
    }
  }
  &:hover {
    .menu-item {
      background-color: rgba(241, 246, 255, 1) !important;
    }
  }
`;

const DropdownToggle = styled(Dropdown.Toggle)`
  display: flex;
  width: auto;
  align-items: center;
  min-height: 50px;
  border: 2px solid ${PRIMARY_ACTIVE_COLOR} !important;
  color: ${PRIMARY_ACTIVE_COLOR} !important;
  background-color: white !important;
  border-radius: 12px;
  padding: 10px 40px 10px 15px;
  font-size: 16px;
  position: relative;
  &:after {
    position: absolute;
    right: 20px;
  }
  &:hover,
  &:active,
  &:focus {
    background-color: white !important;
    border: 2px solid ${PRIMARY_ACTIVE_COLOR} !important;
    color: ${PRIMARY_ACTIVE_COLOR} !important;
  }
`;

const AmountSpan = styled.span`
  color: ${(props) => (props.sign === 'negative' ? 'red' : 'inherit')};
`;

const CustomDateRanger = styled.div`
  margin: 20px 20px 0 0;

  input[type='text'] {
    marginleft: 'auto';
    border: 2px solid ${PRIMARY_ACTIVE_COLOR} !important;
    color: ${PRIMARY_ACTIVE_COLOR} !important;
  }
`;

export default TransactionHistory;
