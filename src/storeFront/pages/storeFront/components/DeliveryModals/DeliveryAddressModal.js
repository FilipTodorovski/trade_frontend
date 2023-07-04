import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import * as types from '../../../../actions/actionTypes';

const { google } = window;
const DeliveryAddressModal = ({ isShow, hideModal }) => {
  const dispatch = useDispatch();

  const { deliveryData } = useSelector((state) => ({
    deliveryData: state.storeFrontReducer.deliveryData,
  }));
  const [location, setLocation] = useState(deliveryData.data.postcode);

  const getDistance = (curPostal) => {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [curPostal],
        // destinations: storeInfo.post_code,
        destinations: ['Dundee DD4, UK'],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          var tempDistance = response.rows[0].elements[0].distance.text;
        } else {
          var tempDistance = 'ERROR';
        }
      }
    );
  };

  const changeLocation = (description) => {
    setLocation(description);
  };

  const onSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      dispatch({
        type: types.UPDAGTE_DELIVERY_INFO,
        payload: {
          ...deliveryData,
          data: {
            ...deliveryData.data,
            postcode: location,
          },
        },
      });
    }
    e.preventDefault();
    hideModal();
  };

  return (
    <Modal
      show={isShow}
      onHide={() => {
        hideModal();
      }}
      size="md"
      centered
    >
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <h3 className="mb-0">Delivery address</h3>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter your postcode</Form.Label>
            {/* <GooglePlacesAutocomplete
              initialValue={location}
              autocompletionRequest={{
                componentRestrictions: {
                  country: 'uk',
                },
              }}
              placeholder="e.g EC4R 3TE"
              inputClassName="form-control ht-form-control"
              onSelect={({ description }) => {
                changeLocation(description);
              }}
              name="geoLocation"
              required
            /> */}
          </Form.Group>
        </Modal.Body>
        <CustomModalFooter>
          <Button
            className="btn-close ht-btn-outline-primary"
            variant="outline-primary"
            onClick={() => {
              hideModal();
            }}
            type="button"
          >
            Close
          </Button>
          <Button type="submit" className="btn-update ht-btn-primary">
            Save
          </Button>
        </CustomModalFooter>
      </Form>
    </Modal>
  );
};

const CustomModalFooter = styled(Modal.Footer)`
  display: flex;
  flex-wrap: nowrap;
  .btn-close {
    flex: 1 2 100%;
  }
  .btn-update {
    flex: 1 1 100%;
  }
`;

export default DeliveryAddressModal;
