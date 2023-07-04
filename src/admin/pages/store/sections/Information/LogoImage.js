import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import StoreLogoImg from 'assets/images/person-icon.svg';

const LogoImage = ({ logo_img, changeLogo }) => {
  const logoRef = useRef(null);

  const changeLogoImg = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      changeLogo({
        logo_img: e.target.result,
        logo_file: file,
      });
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const handleClickLogo = () => {
    if (logoRef.current) logoRef.current.click();
  };

  return (
    <LogoContainer>
      <label className="ht-label">
        Logo<span>(optional)</span>
      </label>
      <ContentDiv>
        <LogoDiv>
          {!logo_img || logo_img.length === 0 ? (
            <img className="store-logo-back" src={StoreLogoImg} alt="Logo" />
          ) : (
            <img className="store-logo-img" src={logo_img} alt="Logo" />
          )}
        </LogoDiv>
        {/* <UploadButton
          className="ht-btn-primary"
          type="button"
          onClick={handleClickLogo}
        >
          Click to upload a photo
        </UploadButton> */}
      </ContentDiv>
      <input
        type="file"
        hidden
        ref={logoRef}
        accept=".jpg, .jpeg, .png, .gif"
        onChange={changeLogoImg}
      />
    </LogoContainer>
  );
};

const LogoContainer = styled.div`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  margin-top: 30px;

  .ht-label {
    span {
      font-weight: normal;
      margin-left: 5px;
    }
  }
`;

const ContentDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const LogoDiv = styled.div`
  width: 100px;
  height: 100px;
  background-color: rgba(116, 51, 255, 0.05);
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .store-logo-back {
    width: 27px;
    height: 35px;
  }

  .store-logo-img {
    width: 100%;
    height: 100%;
  }
`;

const UploadButton = styled(Button)`
  width: 100%;
  max-width: 216px;
  height: 41px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
`;

export default LogoImage;
