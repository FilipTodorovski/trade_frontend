import React from 'react';
import styled from 'styled-components';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import { PRIMARY_ACTIVE_COLOR, SECOND_GREY_COLOR } from 'constants/constants';

const DateRange = ({ style, startDate, endDate, ranges, onChange }) => {
  const handleApply = (event, picker) => {
    onChange({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
  };

  const getLabel = () => {
    const start = startDate.format('Do MMM, YYYY');
    const end = endDate.format('Do MMM, YYYY');
    let label = `${start} - ${end}`;
    if (start === end) {
      label = start;
    }
    return label;
  };

  return (
    <DateRangeContainer style={{ ...style }}>
      <DateRangePicker
        initialSettings={{
          startDate,
          endDate,
          ranges: ranges || false,
        }}
        onApply={handleApply}
      >
        <input
          type="text"
          name="daterange"
          className="form-control"
          // value={getLabel()}
          // disabled
        />
      </DateRangePicker>
    </DateRangeContainer>
  );
};

const DateRangeContainer = styled.div`
  width: 260px;
  height: 50px;

  .form-control {
    height: 100%;
    border-radius 12px;
  }

  .daterangepicker {
    .ranges {
      li {
        &.active {
          background-color: ${PRIMARY_ACTIVE_COLOR};
        }
      }
    }
  }
  .react-bootstrap-daterangepicker-container {
    width: 100%;
    height: 100%;
    position: relative;

    &:after {
      content: '';
      border: 1px solid ${SECOND_GREY_COLOR};
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      margin-top: -4px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      position: absolute;
      right: 13px;
      top: 23px;
    }

    &:focus-within::after {
      content: '';
      border: 1px solid ${PRIMARY_ACTIVE_COLOR};
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      margin-top: -4px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      position: absolute;
      right: 13px;
      top: 23px;
    }

    input[type='text'] {
      width: 100%;
      height: 100%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      color: ${SECOND_GREY_COLOR};
      padding: 10px 15px;
      cursor: pointer;
    }

    .form-control:disabled,
    .form-control[readonly] {
      background-color: #fff;
      opacity: 1;
    }

    input[type='text']:focus {
      border-width: 2px;
      border-color: ${PRIMARY_ACTIVE_COLOR};
      box-shadow: none;
    }
  }
`;

export default DateRange;
