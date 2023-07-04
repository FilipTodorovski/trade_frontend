import React from 'react';
import styled from 'styled-components';
import { Row, Col, Form } from 'react-bootstrap';
import CustomRadio from 'sharedComponents/CustomRadio';
import * as CONSTANTS from 'constants/constants';

const GroupOptionRules = ({ group, setGroup, groupValidate }) => {
  return (
    <RulesContainer className="ht-card">
      <h5>Rules</h5>
      <Form.Label className="ht-label description">
        Set rules to control how customers select items in this option group
      </Form.Label>
      <RadioFormGroup>
        <Form.Label className="ht-label">
          Require customers to select an item?
        </Form.Label>
        <CustomRadio
          id="yes"
          name="yes"
          label="Yes"
          checked={group.require_select_item}
          onChange={(e) => {
            setGroup({
              ...group,
              require_select_item: true,
            });
          }}
        />
        <CustomRadio
          id="no"
          name="no"
          label="No"
          checked={!group.require_select_item}
          onChange={(e) => {
            setGroup({
              ...group,
              require_select_item: false,
            });
          }}
        />
      </RadioFormGroup>
      {group.require_select_item && (
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label className="ht-label">
              What’s the minimum amount of items a customer should select?
            </Form.Label>
            <Form.Control
              className="ht-form-control"
              type="number"
              value={group.min_item_count}
              onChange={(e) => {
                setGroup({
                  ...group,
                  min_item_count: e.target.value.replace(/\D/, ''),
                });
              }}
              style={{ width: '150px', textAlign: 'right' }}
              isInvalid={!groupValidate.min_item_count.validate}
            />
            <Form.Control.Feedback type="invalid">
              {groupValidate.min_item_count.errorMsg}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label className="ht-label">
              What’s the maximum amount of items a customer can select?
            </Form.Label>
            <Form.Control
              className="ht-form-control"
              type="number"
              value={group.max_item_count}
              onChange={(e) => {
                setGroup({
                  ...group,
                  max_item_count: e.target.value.replace(/\D/, ''),
                });
              }}
              style={{ width: '150px', textAlign: 'right' }}
              isInvalid={!groupValidate.max_item_count.validate}
            />
            <Form.Control.Feedback type="invalid">
              {groupValidate.max_item_count.errorMsg}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      )}

      {/* <Form.Group>
        <Form.Label className="ht-label">
          How many times can a customer select any single item?
        </Form.Label>
        <Form.Control
          className="ht-form-control"
          type="number"
          value={group.mutli_item_select}
          onChange={(e) => {
            setGroup({
              ...group,
              mutli_item_select: e.target.value,
            });
          }}
          style={{ width: '150px', textAlign: 'right' }}
          isInvalid={!groupValidate.mutli_item_select.validate}
        />
        <Form.Control.Feedback type="invalid">
          {groupValidate.mutli_item_select.errorMsg}
        </Form.Control.Feedback>
      </Form.Group> */}
    </RulesContainer>
  );
};

const RulesContainer = styled.div`
  margin-top: 60px;
  padding: 40px 40px 50px;
  h5 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0 0 30px 0;
  }

  .description {
    margin: 0 0 25px 0;
  }

  .form-group {
    margin-bottom: 25px;
  }
`;

const RadioFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;

  .bug-radio {
    margin-bottom: 15px !important;
    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`;

export default GroupOptionRules;
