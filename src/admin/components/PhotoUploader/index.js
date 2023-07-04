import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import * as CONSTANTS from 'constants/constants';

const PhotoUploader = ({
  labelString,
  isOptional,
  imgUrl,
  changePhoto,
  minLength,
  fileExtensions,
}) => {
  const photoRef = useRef(null);

  const handleClickPhoto = () => {
    if (photoRef.current) photoRef.current.click();
  };

  const handleChangePhoto = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      changePhoto({
        photo_img: e.target.result,
        photo_file: file,
      });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const renderDescription = () => {
    let returnStr = '';
    if (fileExtensions && fileExtensions.length > 0)
      returnStr = fileExtensions.join(', ');
    else returnStr = 'PNG, JPG, GIF';

    if (minLength) {
      if (returnStr.length > 0) returnStr += ', ';
      returnStr += `File size should at least ${minLength}KB`;
    } else {
      returnStr += ' up to 10MB';
    }
    return returnStr;
  };

  const getFileExtensions = () => {
    if (fileExtensions && fileExtensions.length > 0) {
      const newArr = fileExtensions.map((item) => `.${item}`);
      return newArr.join(', ');
    }
    return '.jpg, .jpeg, .png, .gif';
  };

  return (
    <PhotoUploadrContainer>
      <label className="ht-label">
        {labelString}
        {isOptional && <span>(optional)</span>}
      </label>
      <ImgContainer photo_img={imgUrl}>
        <UploadButton
          className="ht-btn-primary"
          type="button"
          onClick={handleClickPhoto}
        >
          Click to upload a photo
        </UploadButton>
        <p>{renderDescription()}</p>
      </ImgContainer>
      <input
        type="file"
        hidden
        ref={photoRef}
        accept={getFileExtensions()}
        onChange={handleChangePhoto}
      />
    </PhotoUploadrContainer>
  );
};

const PhotoUploadrContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .ht-label {
    span {
      font-weight: normal;
      margin-left: 5px;
    }
  }
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 150px;
  border: ${(props) =>
    props.photo_img ? 'none' : '1.5px dashed rgba(0, 0, 0, 0.1)'};
  background-image: ${(props) =>
    props.photo_img ? `url(${props.photo_img})` : ''};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(116, 51, 255, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  p {
    margin: 10px 0 0 0;
    line-height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.SECOND_GREY_COLOR};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled(Button)`
  width: 236px;
  height: 41px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default PhotoUploader;
