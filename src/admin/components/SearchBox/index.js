import React from 'react';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as CONSTANTS from 'constants/constants';

const SearchBox = ({ searchStr, onSearch, onBlur, style }) => {
  return (
    <SearchBoxContainer style={{ ...style }}>
      <Form.Group>
        <SearchInputDiv>
          <Form.Control
            className="ht-input"
            placeholder="Search..."
            value={searchStr}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            onBlur={onBlur}
          />
          <FontAwesomeIcon className="icon-search" icon={faSearch} />
        </SearchInputDiv>
      </Form.Group>
    </SearchBoxContainer>
  );
};

const SearchBoxContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const SearchInputDiv = styled.div`
  position: relative;
  width: 470px;

  .ht-input {
    width: 100%;
    padding-left: 60px;
  }

  .icon-search {
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
    top: 50%;
    left: 22.5px;
    color: ${CONSTANTS.SECOND_GREY_COLOR};
  }
`;

export default SearchBox;
