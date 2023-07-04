import React from 'react';
import './styles.scss';

const Switch = ({ inputId, isOn, handleToggle, onColor = '#213f5e ' }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={inputId}
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={inputId}
      >
        <span className="react-switch-button" />
      </label>
    </>
  );
};

export default Switch;
