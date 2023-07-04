import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as CONSTANT from 'constants/constants';

const TimeCount = ({ deliveryTime, requestTime }) => {
  const [value, setValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const valueMount = moment(new Date());
    const deliveryMoment = moment(new Date(deliveryTime));
    const duaration = moment.duration(deliveryMoment.diff(valueMount));
    const totalTemp = Math.floor(duaration.asMinutes());

    setTotal(totalTemp);
    setValue(totalTemp);

    totalTemp <= 0 ? setPercent(0) : setPercent(100);
  }, [deliveryTime, requestTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(value - 1);
      if (value <= 0) setPercent(0);
      else {
        const valuePro = parseInt((value / total) * 100, 10);
        if (valuePro < 0) setPercent(0);
        else setPercent(valuePro);
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [value]); // eslint-disable-line

  const renderValue = () => {
    let unitStr = 'min';
    let valueStr = value;

    if (value < 0) {
      if (value < -60 * 24) {
        unitStr = 'day';
        valueStr = Math.floor(value / (60 * 24));
      } else if (value < -60) {
        unitStr = 'hour';
        valueStr = Math.floor(value / 60);
      }
    }

    return (
      <>
        <span style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 1 }}>
          {valueStr}
        </span>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{unitStr}</span>
      </>
    );
  };

  return (
    <TimeCountContainer>
      <CircularProgressbarWithChildren
        value={value > 0 ? 100 - percent : -1}
        strokeWidth={5}
        counterClockwise={false}
        styles={{
          path: {
            stroke: value > 0 ? '#d6d6d6' : 'CONSTANT.PRIMARY_RED_COLOR',
            strokeLinecap: 'butt',
            transition: 'stroke-dashoffset 0s ease 0s',
          },
          trail: {
            stroke: value > 0 ? 'springgreen' : CONSTANT.PRIMARY_RED_COLOR,
          },
        }}
      >
        {renderValue()}
      </CircularProgressbarWithChildren>
    </TimeCountContainer>
  );
};

const TimeCountContainer = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  min-width: 50px;
`;
export default TimeCount;
