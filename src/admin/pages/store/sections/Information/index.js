import React from 'react';
import styled from 'styled-components';
import { postcodeValidator } from 'postcode-validator';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';
import Switch from 'sharedComponents/SwitchButton';
// import LogoImage from './LogoImage';
import PhotoUploader from '../../../../components/PhotoUploader';
import * as CONSTANTS from 'constants/constants';
import { removeSpecialCharacter, makeCapitalCase } from 'utils/string';
import { getStoreCloudImg } from 'utils/cloudImg';
import CONFIG from '../../../../../config';

const InformationSection = ({
  store,
  setStore,
  storeValidate,
  setStoreValidate,
  addressList,
  setAddressList,
  loadAddress,
}) => {
  const lookupAddress = (e) => {
    e.preventDefault();
    setAddressList([]);
    setStore({
      ...store,
      address: '',
    });

    if (postcodeValidator(store.postcode.trim(), 'UK')) {
      setStoreValidate({
        ...storeValidate,
        postcode: {
          validate: true,
          errorMsg: '',
        },
        address: {
          validate: true,
          errorMsg: '',
        },
      });
      loadAddress(store.postcode);
    } else {
      setStoreValidate({
        ...storeValidate,
        postcode: {
          validate: false,
          errorMsg:
            'Sorry we did not recognise that postcode, check and try again',
        },
      });
    }
  };

  return (
    <>
      <DetailsContainer className="ht-card">
        <h5>Store details</h5>
        <FormRow>
          <div className="form-col">
            <Form.Group>
              <Form.Label className="ht-label">Store name</Form.Label>
              <Form.Control
                className="ht-form-control"
                type="input"
                value={store.name}
                onChange={(e) => {
                  setStore({
                    ...store,
                    name: e.target.value,
                    public_address: removeSpecialCharacter(
                      makeCapitalCase(
                        `${store.postcode.substr(0, 3).toUpperCase()} ${
                          e.target.value
                        }`
                      )
                    ),
                  });
                }}
                placeholder="Enter store name"
                isInvalid={!storeValidate.name.validate}
              />
              <Form.Control.Feedback type="invalid">
                {storeValidate.name.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="form-col">
            <Form.Group>
              <Form.Label className="ht-label">Store public URL</Form.Label>
              <Form.Control
                className="ht-form-control"
                type="input"
                value={`${CONFIG.BASE_URL}/${store.public_address}/Menu`}
                disabled
                placeholder="TradeSprint.co.uk/edison"
              />
            </Form.Group>
          </div>
        </FormRow>
        <FormRow>
          <div className="form-col">
            <Form.Group>
              <Form.Label className="ht-label">Email</Form.Label>
              <Form.Control
                className="ht-form-control"
                type="input"
                value={store.email}
                onChange={(e) => {
                  setStore({
                    ...store,
                    email: e.target.value,
                  });
                }}
                placeholder="Enter store email"
                isInvalid={!storeValidate.email.validate}
              />
              <Form.Control.Feedback type="invalid">
                {storeValidate.email.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="form-col">
            <Form.Group>
              <Form.Label className="ht-label">Phone number</Form.Label>
              <Form.Control
                className="ht-form-control"
                type="input"
                value={store.phone_number}
                onChange={(e) => {
                  setStore({
                    ...store,
                    phone_number: e.target.value,
                  });
                }}
                placeholder="01382225836"
                isInvalid={!storeValidate.phone_number.validate}
              />
              <Form.Control.Feedback type="invalid">
                {storeValidate.phone_number.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </FormRow>
        <FormRow>
          <div className="form-col">
            <Form.Group className="d-flex flex-column">
              <Form.Label className="ht-label">Postcode</Form.Label>
              <div className="postcode-div">
                <Form.Control
                  className={`ht-form-control ${
                    storeValidate.postcode.validate ? '' : 'invalidate'
                  }`}
                  type="text"
                  value={store.postcode}
                  onChange={(e) => {
                    setStore({
                      ...store,
                      postcode: e.target.value,
                      public_address: removeSpecialCharacter(
                        makeCapitalCase(
                          `${e.target.value.substr(0, 3)} ${store.name}`
                        )
                      ),
                    });
                  }}
                  placeholder="Enter postcode"
                  isInvalid={!storeValidate.postcode.validate}
                />
                <Button
                  variant="primary"
                  className={`ht-btn-primary btn-lookup ${
                    !store.postcode || store.postcode.length === 0
                      ? 'ht-btn-primary-disable'
                      : ''
                  }`}
                  type="button"
                  onClick={lookupAddress}
                >
                  Lookup
                </Button>
              </div>
              {!storeValidate.postcode.validate && (
                <div className="postcode-invalidate">
                  {storeValidate.postcode.errorMsg}
                </div>
              )}
            </Form.Group>
          </div>
          <div className="accept-order form-col">
            <Form.Group className="d-flex flex-column">
              <Form.Label className="ht-label">
                Are you accepting orders?
              </Form.Label>
              <div className="d-flex" style={{ marginTop: '12px' }}>
                <Switch
                  inputId="store_accept_order"
                  isOn={store.online_status === 0}
                  handleToggle={() => {
                    setStore({
                      ...store,
                      online_status: store.online_status === 0 ? 1 : 0,
                    });
                  }}
                />
              </div>
            </Form.Group>
          </div>
        </FormRow>
        {addressList.length > 0 && (
          <FormRow>
            <div className="form-col">
              <Form.Group className="d-flex flex-column">
                <Form.Label className="ht-label">Address</Form.Label>
                <Select
                  classNamePrefix="select"
                  className={`ht-selector ${
                    storeValidate.address.validate ? '' : 'invalidate'
                  }`}
                  options={addressList.map((item) => {
                    return {
                      value: item._source.line_1,
                      label: item._source.line_1,
                    };
                  })}
                  value={
                    store.address && store.address.length > 0
                      ? { value: store.address, label: store.address }
                      : ''
                  }
                  onChange={(e) => {
                    setStore({
                      ...store,
                      address: e.value,
                    });
                  }}
                  placeholder="Choose your address"
                  isSearchable={false}
                />
                {!storeValidate.address.validate && (
                  <div className="ht-invalid-label">
                    {storeValidate.address.errorMsg}
                  </div>
                )}
              </Form.Group>
            </div>
            <div className="form-col"></div>
          </FormRow>
        )}
      </DetailsContainer>

      <ProfileContainer className="ht-card">
        <h5>Store profile</h5>
        {/* <FormRow>
          <LogoImage
            logo_img={store.logo_img}
            changeLogo={(updatedDate) => {
              setStore({
                ...store,
                ...updatedDate,
              });
            }}
          />
        </FormRow> */}
        <FormRow>
          <Form.Group className="description-formgroup">
            <Form.Label className="ht-label">Store description</Form.Label>
            <p className="form-description">
              Describe your store to your customers - This will be used as your
              bio. We recommend 300-400 characters.
            </p>
            <Form.Control
              className="ht-form-control resize-none"
              as="textarea"
              value={store.description}
              onChange={(e) => {
                setStore({
                  ...store,
                  description: e.target.value,
                });
              }}
              rows="3"
              style={{ height: '120px' }}
              isInvalid={!storeValidate.description.validate}
            />
            <Form.Control.Feedback type="invalid">
              {storeValidate.description.errorMsg}
            </Form.Control.Feedback>
          </Form.Group>
        </FormRow>
        <FormRow className="cover-photo">
          <PhotoUploader
            labelString="Cover Photo"
            isOptional
            imgUrl={store.cover_img}
            changePhoto={(updatedImages) => {
              setStore({
                ...store,
                cover_img: updatedImages.photo_img,
                cover_file: updatedImages.photo_file,
              });
            }}
          />
        </FormRow>
      </ProfileContainer>
    </>
  );
};

const DetailsContainer = styled.div`
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
    margin: 0 0 5px 0;
  }
`;

const FormRow = styled.div`
  display: flex;

  &.cover-photo {
    margin-top: 25px;
  }

  .form-col {
    display: flex;
    flex: 1 1 100%;

    &:last-child {
      margin-left: 80px;
    }
  }

  .form-group {
    margin: 25px 0 0 0;
    flex: 1 1 100%;

    &.description-formgroup {
      .ht-label {
        margin-bottom: 10px;
      }
      .form-description {
        line-height: 17px;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        color: ${CONSTANTS.SECOND_GREY_COLOR};
        margin-bottom: 14px;
      }
    }
  }

  .postcode-div {
    width: 100%;
    display: flex;
    align-item: center;

    .postcode-input {
      flex: 1 1 100%;
    }

    .btn-lookup {
      flex: 0 0 90px;
      padding-left: 0;
      padding-right: 0;
      margin-left: 10px;
    }
  }

  .postcode-invalidate {
    width: 100%;
    margin-top: 0.25rem;
    font-size: 100%;
    color: #d4351c;
  }
`;

const ProfileContainer = styled(DetailsContainer)`
  margin-top: 60px;
`;

export default InformationSection;
