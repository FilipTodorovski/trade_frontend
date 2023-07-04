import React, { useRef } from 'react';
import { Form, Col } from 'react-bootstrap';
import styled from 'styled-components';

const FileUpload = ({
  isOptional,
  imgSrc,
  setImgSrc,
  setImgFile = () => {},
}) => {
  const inputRef = useRef(null);

  const handleClickOpen = (e) => {
    inputRef.current.click();
  };

  const changeImg = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file.size >= 10 * 1024 * 1024) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target.result);
      setImgFile(file);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <Form.Group as={Col} lg="12">
      <Form.Label>
        Image
        {isOptional && <span className="optional-span">(optional)</span>}
      </Form.Label>
      <FileUploadDiv onClick={handleClickOpen}>
        {imgSrc.length ? (
          <img src={imgSrc} alt="cover" />
        ) : (
          <>
            <svg
              data-v-ccab74c2=""
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              className="mx-auto h-12 w-12 text-gray-400"
            >
              <path
                data-v-ccab74c2=""
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <p className="text-primary text-center font-weight-medium">
              Click to upload a file
            </p>
            <p className="text-secondary text-center">
              PNG, JPG, GIF up to 10MB
            </p>
          </>
        )}
      </FileUploadDiv>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept=".jpg, .jpeg, .png, .gif"
        onChange={changeImg}
      />
    </Form.Group>
  );
};

const FileUploadDiv = styled.div`
  display: block;
  text-align: center;
  border-radius: 4px;
  border: 2px dashed #ced4da;
  padding: 2em 1em;
  cursor: pointer;

  svg {
    width: 40px;
  }

  p {
    margin: 0.5em 0 0 0;
  }

  img {
    width: auto;
    height: 200px;
  }
`;
export default FileUpload;
