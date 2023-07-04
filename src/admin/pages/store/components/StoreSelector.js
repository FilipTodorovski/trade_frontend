import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import * as CONSTANTS from 'constants/constants';

const StoreSelector = ({
  selectedOption,
  options,
  setOption,
  availableCreate = false,
}) => {
  const [opened, setOpened] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (ref.current) {
        if (!ReactDOM.findDOMNode(ref.current).contains(event.target)) {
          if (opened) {
            setOpened(false);
          }
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, false);

    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, [ref, opened]);

  return (
    <SelectorContainer>
      <InputContainer
        ref={ref}
        onClick={() => {
          setOpened(!opened);
        }}
        role="button"
      >
        <p>{selectedOption.name ? selectedOption.name : ''}</p>
        <div className="dropdown-arrow">
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </div>
      </InputContainer>
      {opened && (
        <DropdownMenus>
          <div className="select-menu">
            {options.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`select-option ${
                    selectedOption.id === item.id ? 'selected' : ''
                  }`}
                  role="button"
                  onClick={() => {
                    setOption(item.id);
                    setOpened(false);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
          {availableCreate && (
            <div
              className="create-new-store"
              role="button"
              onClick={() => {
                setOption(-1);
              }}
            >
              Create new store
            </div>
          )}
        </DropdownMenus>
      )}
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  position: relative;
  width: 183px;
  margin-left: 30px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 53px;
  border-radius: 12px;
  border: solid 1.5px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 0 12px 0 20px;
  p {
    margin: 0;
  }

  &:hover {
    border-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  }

  .dropdown-arrow {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    padding: 8px;
    -webkit-transition: color 150ms;
    transition: color 150ms;
    box-sizing: border-box;
    margin-left: auto;
    svg {
      fill: hsl(0, 0%, 80%);
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-transition: color 150ms;
      transition: color 150ms;
      box-sizing: border-box;
    }
  }
`;

const DropdownMenus = styled.div`
  top: 100%;
  background-color: hsl(0, 0%, 100%);
  border-radius: 4px;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
  margin-bottom: 8px;
  margin-top: 8px;
  position: absolute;
  width: 100%;
  z-index: 1;
  box-sizing: border-box;

  .select-menu {
    max-height: 300px;
    overflow-y: auto;
    padding-top: 4px;
    position: relative;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;

    .select-option {
      color: #272848;
      cursor: default;
      display: block;
      font-size: inherit;
      padding: 8px 12px;
      width: 100%;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      box-sizing: border-box;
      text-align: center;

      &.selected {
        background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR} !important;
        color: white;
      }

      &:hover {
        background-color: ${CONSTANTS.PRIMARY_ACTIVE_BACK_COLOR};
      }
    }
  }

  .create-new-store {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    font-size: 1rem;
    padding: 15px 0;
    cursor: pointer;
    font-weight: 600;
    &:hover {
      background-color: ${CONSTANTS.PRIMARY_ACTIVE_BACK_COLOR};
    }
  }
`;

export default StoreSelector;
