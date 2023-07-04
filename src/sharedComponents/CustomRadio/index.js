import React from 'react';
import { Form } from 'react-bootstrap';
import './styles.scss';

const CustomRadio = ({
  label = '',
  value = new Date().toString(),
  name = '',
  checked,
  onChange,
}) => {
  const handleChange = (event) => {
    onChange(value);
  };

  return (
    <Form.Group className="bug-radio">
      <Form.Check
        custom
        type="radio"
        label={label}
        id={name}
        name={name}
        onChange={(event) => {
          handleChange(event);
        }}
        checked={checked}
      />
    </Form.Group>
  );
};

export default CustomRadio;
