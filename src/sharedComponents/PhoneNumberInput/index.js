import React from 'react';

import styled from 'styled-components';
import { Dropdown, Form } from 'react-bootstrap';

import { countries, SECOND_GREY_COLOR } from 'constants/constants';

const PhoneNumberInput = ({ wrapperClass, value, onChange }) => {
  const getFlag = (code) => {
    if (!code) return '';
    if (code.length > 0)
      return `url(${require(`assets/images/flags/${code.toLowerCase()}.svg`)})`;
    return '';
  };

  const getFlagWithNumber = () => {
    if (value.dial_code.length === 0) return '';
    const findCountry = countries.find(
      (item) => item.dial_code === value.dial_code && item.code === value.code
    );
    if (findCountry)
      return `url(${require(`assets/images/flags/${findCountry.code.toLowerCase()}.svg`)})`;
    return '';
  };

  return (
    <WrapperComponent>
      <Form.Label className="ht-label">Phone Number</Form.Label>
      <Dropdown>
        <ToggleButton id="phone-number-dropdown">
          <FlagDiv
            style={{
              backgroundImage: getFlagWithNumber(),
            }}
          />
          {value.dial_code.length === 0
            ? 'Select a country number'
            : value.dial_code}
        </ToggleButton>

        <DropDownMenu>
          {countries.map((flagItem) => {
            return (
              <Dropdown.Item
                key={flagItem.code}
                onClick={() => {
                  onChange({
                    ...value,
                    dial_code: flagItem.dial_code,
                    code: flagItem.code,
                  });
                }}
              >
                <FlagDiv
                  style={{
                    backgroundImage: getFlag(flagItem.code),
                  }}
                />
                {flagItem.dial_code}
              </Dropdown.Item>
            );
          })}
        </DropDownMenu>
      </Dropdown>
      <NumberInput
        className="ht-form-control"
        value={value.value}
        onChange={(e) => {
          onChange({
            ...value,
            value: e.target.value,
          });
        }}
        isInvalid={!value.validate}
        autoComplete="new-password"
      />
      <Form.Control.Feedback type="invalid">
        {value.errorMsg}
      </Form.Control.Feedback>
    </WrapperComponent>
  );
};

const WrapperComponent = styled(Form.Group)``;

const ToggleButton = styled(Dropdown.Toggle)`
  background: none !important;
  outline: none !important;
  color: ${SECOND_GREY_COLOR} !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  position: absolute;
  left: 1px;
  top: 1px;
  height: 53px;
  border: none !important;
  border-right: solid 1.5px rgba(0, 0, 0, 0.1) !important;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 110px;
  &: after {
    position: absolute;
    right: 10px;
  }
`;

const DropDownMenu = styled(Dropdown.Menu)`
  width: 110px;
  max-height: 200px;
  overflow-y: auto;
  .dropdown-item {
    display: flex;
    align-items: center;
  }
`;

const FlagDiv = styled.div`
  width: 22px;
  height: 16px;
  background-size: 100% 100%;
  margin-right: 10px;
`;

const NumberInput = styled(Form.Control)`
  padding-left: 120px;
`;

export default PhoneNumberInput;
