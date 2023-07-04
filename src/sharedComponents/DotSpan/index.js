import React from 'react';
import styled from 'styled-components';

import { PRIMARY_ACTIVE_COLOR, PRIMARY_GREY_COLOR } from 'constants/constants';

const DotSpan = ({ status }) => {
  const getStatus = (status) => {
    if (
      status === 'succeeded' ||
      status === 'Payout' ||
      status === 'Authorised'
    )
      return 'active';
    return 'none';
  };

  return <Container status={getStatus(status)}></Container>;
};

const Container = styled.span`
  display: flex;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin-right: 10px;
  background-color: ${(props) =>
    props.status === 'active' ? PRIMARY_ACTIVE_COLOR : PRIMARY_GREY_COLOR};
`;

export default DotSpan;
