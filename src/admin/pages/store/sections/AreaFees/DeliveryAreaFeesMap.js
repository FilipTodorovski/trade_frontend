import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, InputGroup, Button } from 'react-bootstrap';
import Geocode from 'react-geocode';
import _ from 'lodash';

import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
} from 'react-google-maps';
import CONFIG from '../../../../../config';
import * as CONSTANTS from 'constants/constants';

const DeliveryAreaFeesMap = ({ store, setStore, saveStore }) => {
  const [mapCenter, setMapCenter] = useState({});
  const [selectedZone, setSelectedZone] = useState({});
  const [dataValidate, setDataValidate] = useState({
    radius: {
      validate: true,
      errorMsg: '',
    },
    fee: {
      validate: true,
      errorMsg: '',
    },
  });

  useEffect(() => {
    const setDefaultMapCenter = async () => {
      const geoValue = await Geocode.fromAddress(store.postcode);
      setMapCenter({
        lng: geoValue.results[0].geometry.location.lng,
        lat: geoValue.results[0].geometry.location.lat,
      });
    };

    if (store.postcode) {
      Geocode.setApiKey(CONFIG.GOOGLE_API_KEY);
      Geocode.setRegion('uk');
      Geocode.setLanguage('en');
      setDefaultMapCenter();
    }

    if (store.postcode) {
      if (_.get(store.delivery_data, 'zones', []).length === 0) {
        setSelectedZone({
          nIndex: -1,
          radius: 0,
          fee: 0,
        });
      } else {
        setSelectedZone({
          nIndex: -2,
          radius: 0,
          fee: 0,
        });
      }
    }
    setDataValidate({
      radius: {
        validate: true,
        errorMsg: '',
      },
      fee: {
        validate: true,
        errorMsg: '',
      },
    });
  }, [store.postcode, store.delivery_data]);

  const getMaxRadius = () => {
    const deliveryData = _.get(store, 'delivery_data', {});
    if (Object.keys(deliveryData).length === 0) return 0;

    const deliveryZones = _.get(deliveryData, 'zones', []);
    if (deliveryZones.length === 0) return 0;

    return Math.max(...deliveryZones.map((item) => parseFloat(item.radius)));
  };

  const getMaxFee = () => {
    const deliveryData = _.get(store, 'delivery_data', {});
    if (Object.keys(deliveryData).length === 0) return 0;

    const deliveryZones = _.get(deliveryData, 'zones', []);
    if (deliveryZones.length === 0) return 0;

    return Math.max(...deliveryZones.map((item) => parseFloat(item.fee)));
  };

  const handleClickAdd = async (e) => {
    e.preventDefault();
    setStore({
      ...store,
      delivery_data: {
        latLng: { ...mapCenter },
      },
    });
    setDataValidate({
      radius: {
        validate: true,
        errorMsg: '',
      },
      fee: {
        validate: true,
        errorMsg: '',
      },
    });
    setSelectedZone({
      nIndex: -1,
      radius: 0,
      fee: 0,
    });
  };

  const checkDataValidate = () => {
    const validateTemp = {
      radius: {
        validate: true,
        errorMsg: '',
      },
      fee: {
        validate: true,
        errorMsg: '',
      },
    };

    if (selectedZone.nIndex === -1) {
      if (selectedZone.fee <= getMaxFee()) {
        validateTemp.fee.validate = false;
        validateTemp.fee.errorMsg = `Should be bigger than £${getMaxFee()}`;
      }
      if (selectedZone.radius <= getMaxRadius) {
        validateTemp.radius.validate = false;
        validateTemp.radius.errorMsg = `Should be bigger than ${getMaxRadius()}`;
      }
    }

    setDataValidate({
      ...validateTemp,
    });

    return validateTemp.radius.validate && validateTemp.fee.validate;
  };

  const handleClickSave = () => {
    if (!checkDataValidate()) return;
    saveStore({
      ...store,
      delivery_data: {
        ...store.delivery_data,
        latLng: { ...mapCenter },
        zones: [
          ..._.get(store.delivery_data, 'zones', []),
          { radius: selectedZone.radius, fee: selectedZone.fee },
        ],
      },
    });
  };

  const handleClickDeactivate = () => {
    const deliveryZones = _.get(store.delivery_data, 'zones', []);
    if (selectedZone.nIndex === -1) {
      setSelectedZone({
        nIndex: deliveryZones.length === 0 ? -1 : -2,
        radius: 0,
        fee: 0,
      });
      setDataValidate({
        radius: {
          validate: true,
          errorMsg: '',
        },
        fee: {
          validate: true,
          errorMsg: '',
        },
      });

      return;
    }

    if (deliveryZones.length > 0) {
      const zones = deliveryZones.filter(
        (item, idx) => idx !== selectedZone.nIndex
      );

      saveStore({
        ...store,
        delivery_data: {
          ...store.delivery_data,
          zones: [...zones],
        },
      });
    }
  };

  const getSaveButtonStatus = () => {
    if (selectedZone.radius <= getMaxRadius()) return false;
    if (selectedZone.nIndex === -2) return false;
    if (selectedZone.radius > 0 && selectedZone.fee > 0) return true;

    return false;
  };

  const getDeactivateBtnStatus = () => {
    if (selectedZone.nIndex === -2) return false;
    if (!selectedZone || Object.keys(selectedZone).keys === 0) return false;
    if (selectedZone.radius === 0 || selectedZone.fee === 0) return false;

    return true;
  };

  const getComponentStatus = () => {
    if (selectedZone.nIndex === -2) return false;
    if (selectedZone.radius < getMaxRadius()) return false;

    return true;
  };

  return (
    <MapContainer>
      <MyMapComponent
        mapCenter={mapCenter}
        delivery_data={store.delivery_data}
        changeLatLng={(updatedOne) => {
          setStore({
            ...store,
            delivery_data: {
              ...store.delivery_data,
              latLng: { ...updatedOne },
            },
          });
        }}
        selectedZone={selectedZone}
        setSelectedZone={(zone) => {
          setSelectedZone({ ...zone });
        }}
      />

      {store.postcode.length === 0 && Object.keys(selectedZone).length === 0 ? (
        <EnterAddress>
          <h5 className="description">
            Please enter your address before adding delivery zones
          </h5>
          <Button
            className={`ht-btn-primary ${
              store.postcode ? '' : 'ht-btn-primary-disable'
            }`}
            onClick={handleClickAdd}
          >
            Enter your address now
          </Button>
        </EnterAddress>
      ) : (
        <MapDetailContainer>
          <MapDetails>
            <h5 className="map-title">Delivery Zones</h5>
            <div className="map-body">
              <div className="post-code-info">
                <Form.Group>
                  <Form.Label className="ht-label">Radius</Form.Label>
                  <InputGroup className="ht-inputgroup">
                    <Form.Control
                      type="number"
                      className="ht-form-control text-left"
                      placeholder=""
                      value={selectedZone.radius}
                      onChange={(e) => {
                        setSelectedZone({
                          ...selectedZone,
                          radius: parseInt(e.target.value),
                        });
                      }}
                      disabled={!getComponentStatus()}
                      isInvalid={!dataValidate.radius.validate}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>mi</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  {!dataValidate.radius.validate && (
                    <div className="ht-invalid-label">
                      {dataValidate.radius.errorMsg}
                    </div>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label className="ht-label">Delivery fee</Form.Label>
                  <InputGroup className="ht-inputgroup">
                    <InputGroup.Prepend>
                      <InputGroup.Text>£</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="number"
                      className="ht-form-control text-right ht-control-disable"
                      placeholder="0"
                      value={selectedZone.fee}
                      onChange={(e) => {
                        setSelectedZone({
                          ...selectedZone,
                          fee: parseFloat(e.target.value),
                        });
                      }}
                      disabled={!getComponentStatus()}
                      isInvalid={!dataValidate.fee.validate}
                    />
                  </InputGroup>
                  {!dataValidate.fee.validate && (
                    <div className="ht-invalid-label">
                      {dataValidate.fee.errorMsg}
                    </div>
                  )}
                </Form.Group>
              </div>
              <RangeFormGroup>
                <Form.Control
                  type="range"
                  min={0}
                  max={100}
                  value={selectedZone.radius}
                  onChange={(e) => {
                    if (parseFloat(e.target.value) > getMaxRadius())
                      setSelectedZone({
                        ...selectedZone,
                        nIndex: -1,
                        radius: parseFloat(e.target.value),
                      });
                  }}
                  disabled={!getComponentStatus()}
                />
              </RangeFormGroup>
              <SaveButton
                className={`btn-save ht-btn-primary ${
                  getSaveButtonStatus() ? '' : 'ht-btn-primary-disable'
                }`}
                onClick={handleClickSave}
              >
                Add
              </SaveButton>
              <Button
                variant="outline-primary"
                className={`btn-deactivate ht-btn-outline-primary ${
                  getDeactivateBtnStatus() ? '' : 'ht-btn-primary-disable'
                }`}
                onClick={handleClickDeactivate}
              >
                Deactivate
              </Button>
            </div>
          </MapDetails>
        </MapDetailContainer>
      )}
    </MapContainer>
  );
};

const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap
)(
  ({
    mapCenter,
    delivery_data,
    changeLatLng,
    selectedZone,
    setSelectedZone,
  }) => {
    const getCenter = () => {
      const deliveryLatLng = _.get(delivery_data, 'latLng', null);
      if (!deliveryLatLng || Object.keys(deliveryLatLng).length === 0)
        return mapCenter;

      return deliveryLatLng;
    };

    const onMarkerDragEnd = async (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      try {
        Geocode.fromLatLng(lat, lng).then(
          (response) => {
            const { viewport } = response.results[0].geometry;

            if (!viewport) {
              changeLatLng(getCenter());
            }

            const curPostLatLng = getCenter();
            const northest = _.get(viewport, 'northeast', null);
            const southwest = _.get(viewport, 'southwest', null);

            if (
              northest &&
              southwest &&
              northest.lat <= curPostLatLng.lat &&
              curPostLatLng.lat <= southwest.lat &&
              northest.lng <= curPostLatLng.lng &&
              curPostLatLng.lng <= southwest.lng
            )
              changeLatLng({ lat, lng });
            else changeLatLng(getCenter());
          },
          (error) => {
            console.error(error);
            changeLatLng(getCenter());
          }
        );
      } catch (err) {
        changeLatLng(getCenter());
      }
    };

    const onClickMap = () => {
      const zones = _.get(delivery_data, 'zones', null);
      if (zones === null) return;

      if (zones.length === 0)
        setSelectedZone({ nIndex: -1, radius: 0, fee: 0 });
      else setSelectedZone({ nIndex: -2, radius: 0, fee: 0 });
    };

    const onClickCircle = (e, item) => {
      e.stop();
      setSelectedZone({
        ...item,
        radius: parseFloat(item.radius),
      });
    };

    if (Object.keys(mapCenter).length === 0) return null;

    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={mapCenter}
        center={getCenter()}
        mapTypeControlOptions={{
          mapTypeIds: [
            window.google.maps.MapTypeId.ROADMAP,
            window.google.maps.MapTypeId.HYBRID,
          ],
        }}
        mapTypeControl={false}
        mapTypeId={window.google.maps.MapTypeId.ROADMAP}
        onClick={(e) => onClickMap(e)}
      >
        <Marker
          position={getCenter()}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: CONSTANTS.PRIMARY_ACTIVE_COLOR,
            fillOpacity: 1,
            strokeWeight: 0,
          }}
          draggable
          onDragEnd={(e) => onMarkerDragEnd(e)}
        />

        {delivery_data &&
          delivery_data.zones &&
          delivery_data.zones
            .sort((a, b) => b.radius - a.radius)
            .map((item, nIndex) => {
              return (
                <Circle
                  center={getCenter()}
                  radius={item.radius * 1609.344}
                  options={{
                    strokeColor:
                      _.get(selectedZone, 'nIndex', -1) === nIndex
                        ? CONSTANTS.PRIMARY_ACTIVE_COLOR
                        : 'transparent',
                    strokeWeight:
                      _.get(selectedZone, 'nIndex', -1) === nIndex ? 2 : 0,
                    fillColor: CONSTANTS.PRIMARY_ACTIVE_COLOR,
                    fillOpacity: 0.2,
                  }}
                  onClick={(e) => onClickCircle(e, { nIndex, ...item })}
                  key={nIndex}
                />
              );
            })}

        {selectedZone.nIndex === -1 && (
          <Circle
            center={getCenter()}
            radius={selectedZone.radius * 1609.344}
            options={{
              strokeColor: CONSTANTS.PRIMARY_ACTIVE_COLOR,
              strokeWeight: 2,
              fillColor: CONSTANTS.PRIMARY_ACTIVE_COLOR,
              fillOpacity: 0.2,
            }}
            onClick={(e) => {
              e.stop();
            }}
          />
        )}
      </GoogleMap>
    );
  }
);

const MapContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 600px;

  .gmnoprint {
    display: none;
  }

  .gm-style-cc {
    display: none;
  }
`;

const EnterAddress = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  .description {
    font-size: 18px;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: white;
    margin: 0 0 15px 0;
  }
  .ht-btn-primary {
    width: 261px;
    height: 57px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MapDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 40px;
  left: 40px;
  width: 317px;
  height: 396px;
  display: flex;
  flex-direction: column;
`;

const MapDetails = styled.div`
  width: 317px;
  height: auto;
  border-radius: 12px;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;

  .map-title {
    line-height: 60px;
    font-size: 18px;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    height: 60px;
    border-bottom: solid 1.5px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin: 0;
  }

  .map-body {
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ht-label {
      margin-bottom: 10px;
    }

    .post-code-info {
      display: flex;
      margin-left: -8px;
      margin-right: -8px;
      .form-group {
        margin: 0 8px;
        flex: 1 1 100%;
        input {
          height: 40px;
        }
      }
    }
    .btn {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      width: 150px;
      height: 44px;
    }

    .btn-deactivate {
      margin-top: 15px;
    }
  }
`;

const RangeFormGroup = styled(Form.Group)`
  width: 100%;
  margin: 9px 0 0 0;

  input[type='range'] {
    width: 100%;
  }

  input[type='range'] {
    -webkit-appearance: none;
    margin: 18px 0;
    width: 100%;
    outline: none;
    border: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: ${CONSTANTS.SECOND_GREY_COLOR};
    border-radius: 3px;
  }

  input[type='range']:focus::-webkit-slider-runnable-track {
    background: ${CONSTANTS.SECOND_GREY_COLOR};
  }

  input[type='range']::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: ${CONSTANTS.SECOND_GREY_COLOR};
    border-radius: 3px;
  }

  input[type='range']::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  input[type='range']::-ms-fill-lower {
    background: ${CONSTANTS.SECOND_GREY_COLOR};
    border-radius: 3px;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: ${CONSTANTS.SECOND_GREY_COLOR};
  }
  input[type='range']::-ms-fill-upper {
    background: ${CONSTANTS.SECOND_GREY_COLOR};
    border-radius: 3px;
  }
  input[type='range']:focus::-ms-fill-upper {
    background: ${CONSTANTS.SECOND_GREY_COLOR};
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 10px;
    background: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    cursor: pointer;
    margin-top: -8px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
  }

  /* All the same stuff for Firefox */
  input[type='range']::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 10px;
    background: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    cursor: pointer;
  }

  /* All the same stuff for IE */
  input[type='range']::-ms-thumb {
    height: 20px;
    width: 20px;
    border-radius: 10px;
    background: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
    cursor: pointer;
  }
`;

const SaveButton = styled(Button)`
  margin-top: 9px;
`;

export default DeliveryAreaFeesMap;
