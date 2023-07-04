import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';

const MenuNav = ({ categories }) => {
  const menuContainerRef = useRef(null);
  const menuRef = useRef(null);

  const [moreList, setMoreList] = useState([]);
  const [selectedCategoriId, setCategoryId] = useState(-1);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop >= 175) {
      document.getElementById('category-menu-container').style.position =
        'fixed';
      document.getElementById('category-menu-container').style.top = 0;
      document.getElementById('category-menu-container').style.left = 0;
      document.getElementById('category-menu-container').style.width = '100%';
      document.getElementById('category-menu').style.width = `${
        document.getElementById('store-front-left').getBoundingClientRect()
          .width - 30
      }px`;
    } else {
      document.getElementById('category-menu-container').style.position =
        'relative';
    }
    // check product list
    const productLists = document.getElementsByClassName('product-list');
    for (let i = 0; i < productLists.length; i++) {
      const rect = productLists[i].getBoundingClientRect();
      if (rect.top <= 86 && rect.top + rect.height >= 86) {
        setCategoryId(parseInt(productLists[i].getAttribute('category-id'), 0));
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const arrangeMenus = () => {
    const clientRect = menuContainerRef.current.getBoundingClientRect();
    const moreListOne = [];
    for (let i = 0; i < menuRef.current.childElementCount; i++) {
      const btnRect = menuRef.current.children[i].getBoundingClientRect();
      if (clientRect.width - 130 < btnRect.right - clientRect.x + 10) {
        moreListOne.push({
          id: categories[i].id,
          name: categories[i].name,
        });
      }
    }
    setMoreList([...moreListOne]);
  };

  useEffect(() => {
    if (
      menuContainerRef.current &&
      menuRef.current &&
      menuRef.current.childElementCount > 0
    ) {
      arrangeMenus();
    }
  }, [categories, menuContainerRef, menuRef]); // eslint-disable-line

  const moveProductToTop = (id) => {
    setCategoryId(id);
    const elements = document.querySelectorAll(`[category-id="${id}"]`);
    window.scrollTo({
      top: window.scrollY + elements[0].getBoundingClientRect().top - 83,
      behavior: 'smooth',
    });
  };

  const getMoreOptionValue = () => {
    if (selectedCategoriId === -1) return 'More';

    const filteredOne = moreList.filter(
      (item) => item.id === selectedCategoriId
    );
    if (filteredOne.length > 0) return filteredOne[0].name;
    return 'More';
  };

  const checkVisible = (nIndex) => {
    if (moreList.length === 0) return 'true';
    const filterOne = moreList.filter(
      (item) => item.id === categories[nIndex].id
    );
    if (filterOne.length > 0) return 'false';
    return 'true';
  };

  return (
    <MainContainer
      id="category-menu-container"
      className="py-2 border-top border-bottom d-flex justify-content-between align-items-center"
    >
      <div className="container main-container">
        <Row>
          <Col md="8">
            <CategoryMenu id="category-menu" ref={menuContainerRef}>
              <MenuNormal id="menu-normal" ref={menuRef}>
                {categories.map((item, nIndex) => {
                  return (
                    <MenuItem
                      className="menu-item"
                      variant="outline-primary"
                      key={item.id}
                      isactive={(selectedCategoriId === item.id).toString()}
                      onClick={() => moveProductToTop(item.id)}
                      isshow={checkVisible(nIndex)}
                    >
                      {item.name}
                    </MenuItem>
                  );
                })}
              </MenuNormal>
              {moreList.length > 0 && (
                <MoreDropDown
                  active={(
                    moreList.filter((item) => item.id === selectedCategoriId)
                      .length > 0
                  ).toString()}
                  alignRight
                >
                  <Dropdown.Toggle variant="outline-primary">
                    {getMoreOptionValue()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {moreList.map((item) => {
                      return (
                        <Dropdown.Item
                          key={item.name}
                          onClick={() => moveProductToTop(item.id)}
                        >
                          {item.name}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </MoreDropDown>
              )}
            </CategoryMenu>
          </Col>
        </Row>
      </div>
    </MainContainer>
  );
};

export default MenuNav;

const MainContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: white;
  min-height: 54px;
`;

const CategoryMenu = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuNormal = styled.div`
  display: flex;
  overflow: hidden;
`;

const MenuItem = styled(Button)`
  cursor: pointer;
  margin-right: 10px;
  white-space: nowrap;
  border: none;
  color: ${(props) =>
    props.isactive === 'true' ? 'white' : '#213f5e'} !important;
  background: ${(props) =>
    props.isactive === 'true' ? '#213f5e' : 'white'} !important;
  visibility: ${(props) =>
    props.isshow === 'true' ? 'visible' : 'hidden'} !important;
  cursor: ${(props) =>
    props.isshow === 'true' ? 'pointer' : 'none'} !important;
  pointer-events: ${(props) =>
    props.isshow === 'true' ? 'auto' : 'none'} !important;
  box-shadow: none !important;
`;

const MoreDropDown = styled(Dropdown)`
  margin-left: 45px;

  .dropdown-toggle {
    position: relative;
    max-width: 150px;
    border: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: ${(props) =>
      props.active === 'true' ? '#213f5e' : 'white'};
    color: ${(props) => (props.active === 'true' ? 'white' : '#213f5e')};
    padding-right: 22px;    
    &: after {
      position: absolute;
      right: 8px;
      top: 15px;
    }
  }

  &.show {
    .dropdown-toggle {
      background-color: #213f5e;
      border-color: #213f5e;
      box-shadow: 0 0 0 0.2rem rgba(116, 51, 255, 0.5) !important;
    }

  .dropdown-menu {
    z-index: 3;
  }
`;
