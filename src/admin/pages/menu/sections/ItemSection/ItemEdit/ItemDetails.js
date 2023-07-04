import React, { useRef } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import Select from 'react-select';
import { Form, Button, InputGroup } from 'react-bootstrap';
import CustomRadio from 'sharedComponents/CustomRadio';
import { getStoreCloudImg } from 'utils/cloudImg';
import * as CONSTANTS from 'constants/constants';

const ItemDetails = ({
  item,
  setItem,
  itemValidate,
  setItemValidate,
  categoryList,
}) => {
  const itemImgRef = useRef(null);

  const handleClickPhoto = () => {
    itemImgRef.current.click();
  };

  const changeItemPhoto = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setItem({
        ...item,
        photo_img: e.target.result,
        photo_file: file,
      });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const getSelectedCategoryist = (menuValues) => {
    return menuValues.map((itemOne) => {
      return { value: itemOne.id, label: itemOne.name };
    });
  };

  const getCategorSelectClass = () => {
    let categorySelectClass = 'ht-selector category-selector ';
    if (item.sell_its_own) {
      if (!itemValidate.categories.validate)
        categorySelectClass += 'invalidate';
    }

    return categorySelectClass;
  };

  const renderCategoryFeedback = () => {
    if (item.sell_its_own) {
      if (!itemValidate.categories.validate)
        return (
          <div className="ht-invalidate-label">
            {itemValidate.categories.errorMsg}
          </div>
        );
    }

    return null;
  };

  return (
    <ItemDetailContainer className="ht-card">
      <h5>Item details</h5>
      <Form>
        <Form.Group>
          <Form.Label className="ht-label">Product Name</Form.Label>
          <Form.Control
            className="ht-form-control name-input"
            type="input"
            value={item.name}
            onChange={(e) => {
              setItem({
                ...item,
                name: e.target.value,
              });
            }}
            placeholder="Enter Product Name"
            isInvalid={!itemValidate.name.validate}
          />
          <Form.Control.Feedback type="invalid">
            {itemValidate.name.errorMsg}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label className="ht-label">Photo</Form.Label>
          <PhotoContainer>
            {item.photo_img ? (
              <img
                src={getStoreCloudImg(item.photo_img, 'product', 407, 150, '')}
                alt="item"
              />
            ) : (
              <>
                <Button
                  variant="primary"
                  className="btn-upload ht-btn-primary"
                  onClick={handleClickPhoto}
                >
                  Click to upload a photo
                </Button>
                <p>PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </PhotoContainer>
          <input
            type="file"
            hidden
            ref={itemImgRef}
            accept=".jpg, .jpeg, .png, .gif"
            onChange={changeItemPhoto}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="ht-label">Item Description</Form.Label>
          <Form.Control
            className="ht-form-control"
            as="textarea"
            rows="3"
            placeholder="Please describe the item that you're selling."
            value={item.description}
            onChange={(e) => {
              setItem({
                ...item,
                description: e.target.value,
              });
            }}
          />
        </Form.Group>
        {/* <RadioFormGroup>
          <Form.Label className="ht-label">Sell item on its own?</Form.Label>
          <CustomRadio
            id="yes"
            name="yes"
            label="Yes"
            checked={item.sell_its_own}
            onChange={(e) => {
              setItem({
                ...item,
                sell_its_own: true,
              });
            }}
          />
          <CustomRadio
            id="no"
            name="no"
            label="No"
            checked={!item.sell_its_own}
            onChange={(e) => {
              setItem({
                ...item,
                sell_its_own: false,
                groups_info: [],
                categories: [],
              });
              setItemValidate({
                ...itemValidate,
                categories: {
                  validate: true,
                  errorMsg: '',
                },
              });
            }}
          />
        </RadioFormGroup> */}
        <Form.Group>
          <Form.Label className="ht-label">
            Category for the item to appear in
          </Form.Label>
          <Select
            name="category-selector"
            options={categoryList}
            value={getSelectedCategoryist(get(item, 'categories', []))}
            onChange={(e) => {
              setItem({
                ...item,
                categories:
                  e === null
                    ? []
                    : [
                        ...e.map((itemOne) => {
                          return { id: itemOne.value, name: itemOne.label };
                        }),
                      ],
              });
            }}
            className={getCategorSelectClass()}
            classNamePrefix="select"
            isMulti
            placeholder="Add category..."
            isDisabled={!item.sell_its_own}
          />
          {renderCategoryFeedback()}
        </Form.Group>
        <StyledDiv>
          <Form.Group>
            <Form.Label className="ht-label">Sell price</Form.Label>
            <InputGroup className="ht-inputgroup">
              <InputGroup.Prepend>
                <InputGroup.Text>£</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="number"
                className="ht-form-control text-right"
                placeholder="10"
                value={item.base_price}
                onChange={(e) => {
                  setItem({
                    ...item,
                    base_price: e.target.value,
                  });
                }}
                onBlur={(e) => {
                  setItem({
                    ...item,
                    base_price: Number(e.target.value).toFixed(2),
                  });
                }}
                isInvalid={!itemValidate.base_price.validate}
              />
            </InputGroup>
            {!itemValidate.base_price.validate && (
              <div className="ht-invalidate-label">
                {itemValidate.base_price.errorMsg}
              </div>
            )}
          </Form.Group>
          {/* <Form.Group>
            <Form.Label className="ht-label">Vat</Form.Label>
            <InputGroup className="ht-inputgroup">
              <Form.Control
                type="number"
                className="ht-form-control text-left"
                placeholder="10"
                value={item.vat}
                onChange={(e) => {
                  setItem({ ...item, vat: e.target.value });
                }}
                isInvalid={!itemValidate.vat.validate}
              />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {!itemValidate.vat.validate && (
              <div className="ht-invalidate-label">
                {itemValidate.vat.errorMsg}
              </div>
            )}
          </Form.Group> */}
        </StyledDiv>
      </Form>
    </ItemDetailContainer>
  );
};

const ItemDetailContainer = styled.div`
  margin-top: 50px;
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
    margin: 0;
  }

  form {
    margin-top: 30px;

    .form-group {
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 0;
      }

      textarea {
        height: 200px;
      }
      .input-group-prepend {
        .input-group-text {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
      }
      .input-group-append {
        .input-group-text {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
      }
    }

    .name-input {
      width: 100%;
    }
  }
`;

const StyledDiv = styled.div`
  display: flex;
  .form-group {
    width: 235px;
    // &:last-child {
    //   margin-left: 30px;
    // }
  }
`;

const PhotoContainer = styled.div`
  width: 407px;
  height: 150px;
  border: ${(props) =>
    props.photo_img ? 'none' : '1.5px dashed rgba(0, 0, 0, 0.1)'};
  background-color: rgba(116, 51, 255, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .btn-upload {
    line-height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    padding: 12px 40px;
  }

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
  }
`;

const RadioFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
  .bug-radio {
    margin-bottom: 15px !important;
    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`;

export default ItemDetails;
