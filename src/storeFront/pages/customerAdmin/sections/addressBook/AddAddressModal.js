import React, { useState } from 'react';

import { postcodeValidator } from 'postcode-validator';
import styled from 'styled-components';
import Select from 'react-select';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { createAddressBookApi } from 'Apis/CustomerApis';
import { RunToast } from 'utils/toast';
import { addAddressFormValidateSchema } from 'validators';
import { getAddressList, getRegularPostCodeStr } from 'utils/address';
import { getAddresses as getAddressFromElasticApi } from 'Apis/Elastic';
import { getAddresses as getAddressFromFirstClassApi } from 'Apis/SharedApis';

const AddAddressModal = ({ hideModal, setLoading, addDefaultAddress }) => {
  const [addressList, setAddressList] = useState([]);

  const formSubmitProps = useFormik({
    initialValues: {
      postcode: '',
      address: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: addAddressFormValidateSchema,
    onSubmit: async ({ postcode, address }) => {
      setLoading(true);
      createAddressBookApi({
        postcode,
        address,
      })
        .then((res) => {
          if (res.data.success) {
            RunToast('success', 'Add default address success.');
            addDefaultAddress(res.data);
          } else RunToast('error', 'Add default address failed');
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          RunToast('error', 'Add default address failed.');
        });
    },
  });

  const checkPostCodeValiate = () => {
    if (formSubmitProps.errors.postcode) return false;
    const { postcode } = formSubmitProps.values;
    if (!postcodeValidator(postcode.trim(), 'UK')) return false;
    return true;
  };

  const loadAddress = (findPostcode) => {
    getAddressFromElasticApi(getRegularPostCodeStr(findPostcode))
      .then((elasticRes) => {
        setAddressList([...getAddressList(elasticRes.hits.hits[0]._source)]);
      })
      .catch((errElastic) => {
        getAddressFromFirstClassApi(findPostcode)
          .then((res) => {
            if (res.data.success) {
              setAddressList([...getAddressList(res.data.address)]);
            }
          })
          .catch((errFirstClass) => {
            setAddressList([]);
            formSubmitProps.setFieldError({
              postcode:
                'Sorry we did not recognise that postcode, check and try again.',
            });
          });
      });
  };

  const lookupAddress = async (e) => {
    e.preventDefault();
    setAddressList([]);
    formSubmitProps.setFieldValue('address', '');
    let { postcode } = formSubmitProps.values;
    postcode = postcode.trim();
    if (postcodeValidator(postcode, 'UK')) {
      formSubmitProps.setFieldError('address', '');
      loadAddress(postcode);
    } else {
      formSubmitProps.setFieldError(
        'address',
        'Sorry we did not recognise that postcode, check and try again.'
      );
    }
  };

  return (
    <StyledModal
      show={true}
      onHide={hideModal}
      size="md"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Default Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formSubmitProps.handleSubmit}>
          <Form.Group>
            <Form.Label className="ht-label">Postcode</Form.Label>
            <div className="postcode-div">
              <Form.Control
                id="postcode"
                name="postcode"
                type="text"
                className="ht-form-control postcode-input"
                value={formSubmitProps.values.postcode}
                onChange={formSubmitProps.handleChange}
                placeholder="Enter postcode"
                isInvalid={
                  formSubmitProps.touched.postcode && !checkPostCodeValiate()
                }
              />
              <Button
                variant="primary"
                className={`ht-btn-primary btn-lookup ${
                  !checkPostCodeValiate() ? 'ht-btn-primary-disable' : ''
                }`}
                type="button"
                onClick={lookupAddress}
              >
                Lookup
              </Button>
            </div>
            {!checkPostCodeValiate() && (
              <div className="ht-invalid-label">
                {formSubmitProps.errors.postcode || 'Invalid postcode.'}
              </div>
            )}
          </Form.Group>
          {addressList.length > 0 && (
            <Form.Group>
              <Form.Label className="ht-label">Address</Form.Label>
              <Select
                classNamePrefix="select"
                className={`ht-selector ${
                  formSubmitProps.errors.address && 'invalidate'
                }`}
                options={addressList.map((item) => {
                  return { value: item.label, label: item.label };
                })}
                value={{
                  value: formSubmitProps.values.address,
                  label: formSubmitProps.values.address,
                }}
                onChange={(e) => {
                  formSubmitProps.setFieldValue('address', e.value);
                }}
                onBlur={formSubmitProps.handleBlur}
                placeholder="Choose your address"
                isSearchable={false}
              />
              <div className="ht-invalid-label">
                {formSubmitProps.errors.address}
              </div>
            </Form.Group>
          )}

          <div className="btn-container mt-5">
            <Button
              className="ht-btn-outline-primary"
              variant="outline"
              onClick={() => {
                hideModal();
              }}
            >
              Cancel
            </Button>
            <Button className="ht-btn-primary ml-2" type="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .modal-title {
    text-align: center;
    width: 100%;
  }

  .modal-body {
    padding: 2rem 0;

    .form-group {
      padding: 0 2rem;
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

  .btn-container {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #dee2e6;
    padding: 1rem 2rem 0;
  }
`;

export default AddAddressModal;
