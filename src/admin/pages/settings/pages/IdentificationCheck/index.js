import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import _ from 'lodash';
import styled from 'styled-components';
import { Container, Card, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

import ApiService from 'admin/ApiService';
import AppContainer from '../../../../components/AppContainer';
import PhotoUploader from '../../../../components/PhotoUploader';
import HtSpinner from '../../../../components/HtSpinner';
import SuccessModal from 'sharedComponents/SuccessModal';

import {
  getToken,
  PRIMARY_DARK_COLOR,
  ADYEN_DOCUMENT_TYPE,
} from 'constants/constants';
import LogoTextSvg from 'assets/images/logo-text.svg';
import LockSvg from 'assets/images/lock.svg';
import PassportSvg from 'assets/images/passport.svg';
import DriverLicenceSvg from 'assets/images/driver-licence.svg';
import GovernmentSvg from 'assets/images/government.svg';

const SELECT_ID_PANEL = 0;
const UPLOAD_DOCUMENT_PANEL = 1;

const IdentificationCheck = () => {
  const history = useHistory();
  const [adyenInfo, setAdyenInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [curPage, setCurPage] = useState(SELECT_ID_PANEL);
  const [shareHolder, setShareHolder] = useState({});
  const [formData, setFormData] = useState({
    documentContent: '',
    fileName: '',
    fileValidate: {
      validate: true,
      errorMsg: '',
    },
    documentType: '',
  });

  const getShareHolders = (accountHolder) => {
    const accountHolderDetails = _.get(
      accountHolder,
      'accountHolderDetails',
      null
    );
    if (accountHolderDetails === null) return [];

    const businessDetails = _.get(
      accountHolderDetails,
      'businessDetails',
      null
    );
    if (businessDetails === null) return [];
    const shareHolders = _.get(businessDetails, 'shareholders', []);
    if (shareHolders.length === 0) return [];
    return shareHolders;
  };

  const getShareHolderOptions = (accountHolder) => {
    const shareHolders = getShareHolders(accountHolder);
    if (!shareHolders || shareHolders.length === 0) return [];
    const shareHolderOptions = [];
    shareHolders.forEach((item) => {
      const name = _.get(item, 'name', null);
      const firstName = _.get(name, 'firstName', '');
      const lastName = _.get(name, 'lastName', '');
      const shareHolderCode = _.get(item, 'shareholderCode', '');
      shareHolderOptions.push({
        value: shareHolderCode,
        label: `${firstName} ${lastName}`,
      });
    });
    return shareHolderOptions;
  };

  const setDefaultShareHolderValue = (accountHolder) => {
    const shareHolderOptions = getShareHolderOptions(accountHolder);
    if (shareHolderOptions.length > 0)
      setShareHolder({ ...shareHolderOptions[0] });
  };

  const checkBusinessAccount = () => {
    return _.get(adyenInfo, 'legalEntity', '') === 'Business';
  };

  useEffect(() => {
    setLoading(true);
    ApiService({
      method: 'GET',
      url: '/adyen/accountholder',
      ...getToken(),
    })
      .then((res) => {
        if (res.data.success) {
          setAdyenInfo({
            ...res.data.accountHolder,
          });
          setDefaultShareHolderValue(res.data.accountHolder);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []); // eslint-disable-line

  const handleClickId = (cardKind) => {
    setCurPage(UPLOAD_DOCUMENT_PANEL);
    setFormData({
      ...formData,
      documentType: cardKind,
    });
  };

  const checkPrimaryButtonStatus = () => {
    if (loading) return false;
    if (curPage === UPLOAD_DOCUMENT_PANEL) {
      if (formData.documentContent.length > 0 && formData.fileName.length > 0) {
        return true;
      }
    }
    return false;
  };

  const getDocumentKindDescription = () => {
    switch (formData.documentType) {
      case ADYEN_DOCUMENT_TYPE.PASSPORT:
        return 'Picture of your PASSPORT Document';
      case ADYEN_DOCUMENT_TYPE.ID_CARD_FRONT:
        return 'Front of your ID Document';
      case ADYEN_DOCUMENT_TYPE.ID_CARD_BACK:
        return 'Back of your ID Document';
      case ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_FRONT:
        return 'Front of your Driver Licence Document';
      case ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_BACK:
        return 'Back of your Driver Licence Document';
      default:
        return 'Picture of your PASSPORT Document';
    }
  };

  const handleClickUpload = (e) => {
    e.preventDefault();

    const tempFormData = { ...formData };
    if (tempFormData.fileName.length === 0)
      tempFormData.fileValidate = {
        validate: false,
        errorMsg: `Please upload your ${formData.documentType}`,
      };
    else if (tempFormData.documentContent.length < 100000)
      tempFormData.fileValidate = {
        validate: false,
        errorMsg: 'File size should be at least 10KB',
      };
    else
      tempFormData.fileValidate = {
        validate: true,
        errorMsg: '',
      };

    setFormData({
      ...tempFormData,
    });

    if (!tempFormData.fileValidate.validate) return;
    setLoading(true);

    const requestBody = {
      documentContent: formData.documentContent,
      documentDetail: {
        accountHolderCode: adyenInfo.accountHolderCode,
        documentType: formData.documentType,
        // filename: adyenInfo.fileName,
        filename: 'PASSED.jpg',
        description: 'PASSED',
      },
    };
    if (checkBusinessAccount) {
      requestBody.documentDetail.shareholderCode = shareHolder.value;
    }
    ApiService({
      method: 'POST',
      url: '/adyen/uploadAccountHolderDocument',
      data: {
        ...requestBody,
      },
      ...getToken(),
    })
      .then((res) => {
        setShowSuccessModal(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const hideSuccessModal = () => {
    if (formData.documentType === ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_FRONT) {
      setFormData({
        ...formData,
        documentType: ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_BACK,
        documentContent: '',
        fileName: '',
        fileValidate: {
          validate: true,
          errorMsg: '',
        },
      });
      setShowSuccessModal(false);
    } else if (formData.documentType === ADYEN_DOCUMENT_TYPE.ID_CARD_FRONT) {
      setFormData({
        ...formData,
        documentType: ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_BACK,
        documentContent: '',
        fileName: '',
        fileValidate: {
          validate: true,
          errorMsg: '',
        },
      });
      setShowSuccessModal(false);
    } else history.push('/settings/payments');
  };

  const getSuccessModalTitle = () => {
    if (formData.documentType === ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_FRONT)
      return 'Front of your Driver Licence Document uploaded successfully.';
    if (formData.documentType === ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_BACK)
      return 'Back of your Driver Licence Document uploaded successfully.';
    if (formData.documentType === ADYEN_DOCUMENT_TYPE.ID_CARD_FRONT)
      return 'Front of your Identity Document uploaded successfully.';
    if (formData.documentType === ADYEN_DOCUMENT_TYPE.ID_CARD_BACK)
      return 'Back of your Identity Document uploaded successfully.';
    if (formData.documentType === ADYEN_DOCUMENT_TYPE.PASSPORT)
      return 'Your Passport Document uploaded successfully';
    return 'Your Passport Document uploaded successfully';
  };

  return (
    <AppContainer>
      <MenuContainer>
        <TopHeader>
          <h1>Identification Check</h1>
          <UploadButton
            className={`ht-btn-primary ${
              checkPrimaryButtonStatus() ? '' : 'ht-btn-primary-disable'
            }`}
            onClick={handleClickUpload}
          >
            Upload Document
          </UploadButton>
        </TopHeader>
        <MainCard className="ht-card">
          <CardHeader>
            <img className="logo" src={LogoTextSvg} alt="logo" />
            <div className="card-description">
              <img src={LockSvg} alt="lock" />
              <h6>SECURE IDENTIFICATION VERIFICATION</h6>
            </div>
          </CardHeader>
          <CardBody>
            {checkBusinessAccount() && (
              <ShareHolderSelector>
                <Form.Group
                  style={{
                    width: '100%',
                  }}
                >
                  <Form.Label className="ht-label">Shareholder</Form.Label>
                  <Select
                    value={shareHolder}
                    options={getShareHolderOptions(adyenInfo)}
                    onChange={setShareHolder}
                    className="ht-selector"
                    classNamePrefix="select"
                    isDisabled={curPage !== SELECT_ID_PANEL}
                  />
                </Form.Group>
              </ShareHolderSelector>
            )}
            {curPage === SELECT_ID_PANEL && (
              <SelectIdentityContainer>
                <p className="description">
                  Which document would you like to verify?
                </p>
                <p
                  className="description"
                  style={{ fontWeight: 'normal', margin: '16px 0 0 0' }}
                >
                  You will need to provide us with a Goverment issued ID
                </p>
                <div className="id-selector-div">
                  <div
                    className="id-selector"
                    role="button"
                    onClick={() =>
                      handleClickId(ADYEN_DOCUMENT_TYPE.DRIVING_LICENCE_FRONT)
                    }
                  >
                    <img src={GovernmentSvg} alt="Passport" />
                    <p>Driver Licence</p>
                  </div>
                  <div
                    className="id-selector"
                    role="button"
                    onClick={() =>
                      handleClickId(ADYEN_DOCUMENT_TYPE.ID_CARD_FRONT)
                    }
                    style={{
                      borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <img src={DriverLicenceSvg} alt="Passport" />
                    <p>Gov ID Card</p>
                  </div>
                  <div
                    className="id-selector"
                    role="button"
                    onClick={() => handleClickId(ADYEN_DOCUMENT_TYPE.PASSPORT)}
                  >
                    <img src={PassportSvg} alt="Passport" />
                    <p>Passport</p>
                  </div>
                </div>
              </SelectIdentityContainer>
            )}
            {curPage === UPLOAD_DOCUMENT_PANEL && (
              <UploadPanel>
                <p className="description">{getDocumentKindDescription()}</p>
                <p
                  className="description"
                  style={{ margin: '16px 0 30px', fontWeight: 'normal' }}
                >
                  Please make sure this is clear and easy to read
                </p>
                <PhotoUploader
                  isOptional={false}
                  imgUrl={formData.documentContent}
                  changePhoto={(updatedImage) => {
                    setFormData({
                      ...formData,
                      documentContent: updatedImage.photo_img,
                      fileName: updatedImage.photo_file.name,
                    });
                  }}
                  minLength={100}
                  fileExtensions={['JPG']}
                />
                {!formData.fileValidate.validate && (
                  <div className="ht-invalidate-label">
                    {formData.fileValidate.errorMsg}
                  </div>
                )}
              </UploadPanel>
            )}
          </CardBody>
          {loading && <HtSpinner />}
        </MainCard>
      </MenuContainer>

      {showSuccessModal && (
        <SuccessModal
          show
          title={getSuccessModalTitle()}
          hideModal={hideSuccessModal}
        />
      )}
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  max-width: 974px;
`;

const TopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-contents: space-around;
  margin: 0 0 40px 0;
  h1 {
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    margin: 0;
  }
`;

const MainCard = styled(Card)`
  display: flex;
  flex-direction: column;
  background: rgba(116, 51, 255, 0.05);
  border: 1px dashed rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  border-radius: 12px;
  width: 100%;
  max-width: 772px;
  min-height: 464px;
  margin: 40px auto 0;
  position: relative;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 0 36px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .card-description {
    margin: 18px 0 0 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    h6 {
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      color: ${PRIMARY_DARK_COLOR};
      margin: 6px 0 0 0;
    }
    img {
      margin-right: 22px;
    }
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 31px 0 40px;
  align-items: center;
  .description {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: ${PRIMARY_DARK_COLOR};
    margin: 0;
  }
`;

const SelectIdentityContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 386px;
  align-items: flex-start;
  .id-selector-div {
    display: flex;
    margin: 27px 0 0 0;
    width: 100%;
    height: 98px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 12px;
    .id-selector {
      display: flex;
      flex-direction: column;
      flex: 1 1 100%;
      padding: 27px 16px 16px;
      align-items: center;
      p {
        font-size: 12px;
        color: ${PRIMARY_DARK_COLOR};
        margin: auto 0 0 0;
        font-weight: 600;
      }
    }
  }
`;

const ShareHolderSelector = styled.div`
  width: 100%;
  max-width: 386px;
  display: flex;
  margin: 0 0 15px 0;
`;

const UploadPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 34px;
  width: 100%;
  .description {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    color: ${PRIMARY_DARK_COLOR};
  }
`;

const UploadButton = styled(Button)`
  margin-left: auto;
`;
export default IdentificationCheck;
