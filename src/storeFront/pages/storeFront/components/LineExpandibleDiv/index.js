import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const LineExpandibleDiv = ({
  lineLimit,
  fontSize,
  lineHeight,
  bgColor = 'white',
  content,
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const refHeight = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (refHeight && refHeight.current) {
        if (
          refHeight.current.getBoundingClientRect().height <
          lineLimit * lineHeight
        )
          setExpanded(true);
      }
    }, 100);
  }, [content]); // eslint-disable-line

  return (
    <Container
      fontSize={fontSize}
      lineHeight={lineHeight}
      height={isExpanded ? 'auto' : `${lineLimit * lineHeight}px`}
      ref={refHeight}
      onClick={() => {
        setExpanded(true);
      }}
    >
      <div>{content}</div>
      {!isExpanded && (
        <ExpandSvg height="24" width="24" viewBox="0 0 24 24" bgColor={bgColor}>
          <path d="M4.88398 7.11612L3.11621 8.88389L12.0001 17.7678L20.884 8.88389L19.1162 7.11612L12.0001 14.2322L4.88398 7.11612Z"></path>
        </ExpandSvg>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  font-size: ${(props) => props.fontSize};
  line-height: ${(props) => props.lineHeight}px;
  overflow: hidden;
  height: auto;
  max-height: ${(props) => props.height};
  cursor: pointer;
`;

const ExpandSvg = styled.svg`
  position: absolute;
  fill: #213f5e;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.bgColor};
`;

export default LineExpandibleDiv;
