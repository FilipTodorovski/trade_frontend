import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'react-bootstrap';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const SearchStorePage = ({ history }) => {
  return (
    <div className="container">
      <Card className="mt-5">
        <Card.Body>
          {/* <GooglePlacesAutocomplete
            autocompletionRequest={{
              componentRestrictions: {
                country: 'uk',
              },
            }}
            placeholder="e.g EC4R 3TE"
            inputClassName="form-control"
            onSelect={(e) => {
              history.push(
                `/store/list?postcode=${e.structured_formatting.main_text}`
              );
            }}
            name="geoLocation"
            required
          /> */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default withRouter(SearchStorePage);
