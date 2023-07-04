import React from 'react';
import styled from 'styled-components';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import get from 'lodash/get';
import * as CONSTANTS from 'constants/constants';

const CustomDropDown = ({ id, value, options, onChange }) => {
  return (
    <CustomDropDownContainer>
      <DropdownButton
        id={id}
        title={get(value, 'name', '')}
        disabled={options.length === 0}
      >
        {options &&
          options.length > 0 &&
          options.map((option, idx) => {
            return (
              <Dropdown.Item
                key={`${id}-${idx}`}
                active={get(value, 'id', null) === option.id}
              >
                <div onClick={() => onChange(option)}>{option.name}</div>
              </Dropdown.Item>
            );
          })}
      </DropdownButton>
    </CustomDropDownContainer>
  );
};

const CustomDropDownContainer = styled.div`
  .btn-primary {
    color: ${CONSTANTS.SECOND_GREY_COLOR} !important;
    background-color: white !important;
    border-color: rgba(0, 0, 0, 0.1) !important;
    height: 50px;
    border-radius: 12px;
    padding: 10px 15px;
    min-width: 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-primary:focus {
    box-shadow: none !important;
    color: ${CONSTANTS.SECOND_GREY_COLOR} !important;
    background-color: white !important;
    border-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR} !important;
    border-width: 2px !important;
  }

  .dropdown-item {
    color: ${CONSTANTS.SECOND_GREY_COLOR};
    margin: 5px 0;
  }

  .dropdown-item.active {
    color: white;
    background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR} !important;
  }
  .dropdown-item:active {
    background-color: rgba(241, 246, 255, 1) !important;
  }

  .dropdown-toggle::after {
    border: 1px solid ${CONSTANTS.SECOND_GREY_COLOR};
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    margin-top: -4px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .dropdown-menu {
    max-height: 241px;
    overflow-y: auto;
  }

  .dropdown-menu.show {
    min-width: 100%;
    background: white;
    border-radius: 12px;
  }
`;

export default CustomDropDown;
