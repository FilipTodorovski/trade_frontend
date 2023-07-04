import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { startOfToday } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import * as CONSTANTS from 'constants/constants';
import { endOfDay } from 'utils/date';

const MenuHours = ({ menu, changeMenu }) => {
  const changeHours = (hoursData, nIndex) => {
    const hoursTemp =
      _.get(menu, 'open_hours', []) === null
        ? []
        : _.get(menu, 'open_hours', []);
    hoursTemp[nIndex] = [...hoursData];
    if (hoursTemp[nIndex][1].length === 0) hoursTemp.splice(nIndex, 1);
    changeMenu({
      open_hours: hoursTemp,
    });
  };

  const handleClickAddHour = () => {
    changeMenu({
      open_hours:
        menu.open_hours === null
          ? [[[], [{ start: [8, 0], end: [20, 0] }]]]
          : [...menu.open_hours, [[], [{ start: [8, 0], end: [20, 0] }]]],
    });
  };

  return (
    <MenuHoursContainer className="ht-card">
      <h5 className="sub-title">Catalogue hours</h5>
      <p className="description">
        Input your opening times for this particular catalogue
        </p>
      {_.get(menu, 'open_hours', []) !== null && (
        <>
          {_.get(menu, 'open_hours', []).map((item, nIndex) => {
            return (
              <HoursPanel
                key={nIndex}
                nIndex={nIndex}
                openHours={_.get(menu, 'open_hours', [])}
                changeHours={(hoursData) => {
                  changeHours(hoursData, nIndex);
                }}
                totalCount={_.get(menu, 'open_hours', []).length}
              />
            );
          })}
        </>
      )}
      <AddMoreHoursBtn variant="link" onClick={handleClickAddHour}>
        Add more days and times
      </AddMoreHoursBtn>
    </MenuHoursContainer>
  );
};

const MenuHoursContainer = styled.div`
  margin-top: 60px;
  padding: 40px 40px 50px;
  .sub-title {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0;
  }
  .description {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 17px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 30px 0 25px 0;
  }
`;

const AddMoreHoursBtn = styled(Button)`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 17px;
  letter-spacing: normal;
  text-decoration: none !important;
  color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  padding: 0;
`;

const HoursPanel = ({ nIndex, openHours, changeHours, totalCount }) => {
  const checkItemActive = (dayIndex) => {
    return _.includes(openHours[nIndex][0], dayIndex);
  };

  const checkItemDisable = (dayIndex) => {
    const filteredOne = openHours.filter(
      (item, nItemIndex) => nItemIndex !== nIndex
    );

    let isExist = false;
    if (filteredOne.length > 0) {
      filteredOne.forEach((item) => {
        if (!isExist && item.length > 0)
          isExist = _.includes(item[0], dayIndex);
      });
      return isExist;
    }
    return false;
  };

  const handleClickDay = (dayIndex) => {
    const selectedHours = [...openHours[nIndex]];
    if (selectedHours.length === 0) {
      selectedHours.push([dayIndex]);
      selectedHours.push([]);
      changeHours(selectedHours, nIndex);
    } else {
      const index = selectedHours[0].indexOf(dayIndex);
      if (index > -1) selectedHours[0].splice(index, 1);
      else {
        selectedHours[0].push(dayIndex);
        selectedHours[0].sort();
      }
      changeHours(selectedHours, nIndex);
    }
  };

  const handleClickAdd = (nItemIndex) => {
    const selectedHours = [...openHours[nIndex]];
    const tempDate = new Date();
    tempDate.setHours(selectedHours[1][selectedHours[1].length - 1].end[0]);
    tempDate.setMinutes(selectedHours[1][selectedHours[1].length - 1].end[1]);
    const startDate = new Date(tempDate.valueOf() + 15 * 60 * 1000);
    let endDate = new Date(tempDate.valueOf() + 30 * 60 * 1000);
    if (endDate.valueOf() > endOfDay().valueOf()) endDate = endOfDay();

    selectedHours[1].push({
      start: [startDate.getHours(), startDate.getMinutes()],
      end: [endDate.getHours(), endDate.getMinutes()],
    });
    changeHours(selectedHours, nIndex);
  };

  const handleClickTrash = (nItemIndex) => {
    const selectedHours = [...openHours[nIndex]];
    selectedHours[1] = selectedHours[1].filter(
      (item, nIndexOne) => nItemIndex !== nIndexOne
    );
    changeHours(selectedHours, nIndex);
  };

  const getSelectedHours = (nHour, nDate) => {
    const returnDate = new Date();
    returnDate.setHours(nHour);
    returnDate.setMinutes(nDate);
    return returnDate;
  };

  const changeHourValue = (date, nItemIndex, isStart) => {
    const selectedHours = [...openHours[nIndex]];
    selectedHours[1][nItemIndex][isStart][0] = date.getHours();
    selectedHours[1][nItemIndex][isStart][1] = date.getMinutes();
    changeHours(selectedHours, nIndex);
  };

  const getStartEnableHours = (nItemIndex) => {
    if (nItemIndex === 0) {
      return startOfToday();
    }
    const selectedHours = [...openHours[nIndex]];
    const dateTemp = new Date();
    dateTemp.setHours(selectedHours[1][nItemIndex - 1].end[0]);
    dateTemp.setMinutes(selectedHours[1][nItemIndex - 1].end[1]);
    return new Date(dateTemp.valueOf() + 15 * 60 * 1000);
  };

  const getEndEnableHours = (nItemIndex) => {
    const selectedHours = [...openHours[nIndex]];
    const dateTemp = new Date();
    dateTemp.setHours(selectedHours[1][nItemIndex].start[0]);
    dateTemp.setMinutes(selectedHours[1][nItemIndex].start[1]);
    return new Date(dateTemp.valueOf() + 15 * 60 * 1000);
  };

  const renderHourDeleteBtn = (nItemIndex) => {
    if (nItemIndex === 0 && totalCount === 1) return null;
    return (
      <DeleteButton
        onClick={() => {
          handleClickTrash(nItemIndex);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </DeleteButton>
    );
  };

  const renderHours = () => {
    if (
      openHours === null ||
      openHours.length === 0 ||
      openHours[nIndex].length === 0 ||
      openHours[nIndex][1].length === 0
    )
      return <></>;
    return (
      <HourSelectorContainer>
        {openHours[nIndex][1].map((item, nItemIndex) => {
          return (
            <HourSelector key={nItemIndex}>
              <div className="time-div">
                <div className="time-label">{'From: '}</div>
                <DatePicker
                  selected={getSelectedHours(item.start[0], item.start[1])}
                  onChange={(date) =>
                    changeHourValue(date, nItemIndex, 'start')
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH  :  mm"
                  className="time-picker"
                  minDate={new Date()}
                  minTime={getStartEnableHours(nItemIndex)}
                  maxTime={endOfDay()}
                />
              </div>
              <div className="time-div">
                <div className="time-label">{'To: '}</div>
                <DatePicker
                  selected={getSelectedHours(item.end[0], item.end[1])}
                  onChange={(date) => changeHourValue(date, nItemIndex, 'end')}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH  :  mm"
                  className="time-picker"
                  minDate={new Date()}
                  minTime={getEndEnableHours(nItemIndex)}
                  maxTime={endOfDay()}
                />
              </div>
              <PlusButton
                onClick={() => {
                  handleClickAdd(nItemIndex);
                }}
              >
                +
              </PlusButton>
              {renderHourDeleteBtn(nItemIndex)}
            </HourSelector>
          );
        })}
      </HourSelectorContainer>
    );
  };

  return (
    <HoursPanelDiv>
      <DaysSelector>
        {CONSTANTS.DAY_NAMES.map((item, nIndexOne) => {
          return (
            <li
              key={nIndexOne}
              className={`
              ${checkItemActive(nIndexOne) ? 'active' : ''}
              ${checkItemDisable(nIndexOne) ? 'disabled' : ''}
              `}
              onClick={() => {
                handleClickDay(nIndexOne);
              }}
            >
              {item}
            </li>
          );
        })}
      </DaysSelector>
      {renderHours()}
      <HourSelector />
    </HoursPanelDiv>
  );
};

const HoursPanelDiv = styled.div`
  display: flex;
  width: 100%;
  max-width: 554px;
  flex-direction: column;
  border-radius: 12px;
  background-color: rgba(39, 40, 72, 0.05);
  margin-bottom: 25px;
  padding: 32px 40px 35px;
`;

const DaysSelector = styled.ul`
  display: flex;
  flex: 1 1 100%;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  border: solid 1.5px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  li {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    flex: 1 1 100%;
    height: 53px;
    line-height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.SECOND_GREY_COLOR};
    cursor: pointer;
    background: white;
    border-right: 1px solid #e6e6e6;

    &.active {
      background-color: ${CONSTANTS.PRIMARY_ACTIVE_BACK_COLOR};
      color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    }

    &.disabled {
      opacity: 0.7;
      color: ${CONSTANTS.SECOND_GREY_COLOR} !important;
    }

    &:last-child {
      border: none;
    }
    &:hover {
      color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    }
  }
`;

const HourSelectorContainer = styled.div``;

const HourSelector = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  margin-top: 15px;
  align-items: center;
  &:first-child {
    margin-top: 25px;
  }

  .time-div {
    display: flex;
    align-item: center;
    margin-left: 25px;
    &:first-child {
      margin-left: 0;
    }

    .time-label {
      display: flex;
      align-items: center;
      font-size: 1rem;
      line-height: 17px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      color: ${CONSTANTS.PRIMARY_DARK_COLOR};
      margin-right: 15px;
    }

    .time-picker {
      width: 120px;
      height: 49px;
      border-radius: 12px;
      border: solid 1.5px rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
      text-align: center;

      line-height: 17px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      color: ${CONSTANTS.PRIMARY_DARK_COLOR};

      &:focus {
        outline: none;
        border-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
      }
    }

    .dvidie {
      padding-left: ;
    }
  }
`;

const PlusButton = styled(Button)`
  color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: solid 1.5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-left: 25px;
  cursor: pointer;
`;

const DeleteButton = styled(Button)`
  color: ${CONSTANTS.SECOND_GREY_COLOR};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: solid 1.5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-left: auto;
  &.disabled {
    pointer-events: none !important;
    opacity: 0.7 !important;
    background-color: white !important;
    border: solid 1.5px rgba(0, 0, 0, 0.1) !important;
    color: ${CONSTANTS.SECOND_GREY_COLOR} !important;
  }
`;

export default MenuHours;
