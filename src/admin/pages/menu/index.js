import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import AppContainer from '../../components/AppContainer';
import TopSectionSelector from './TopSectionSelector';
import * as CONSTANTS from '../../constants';
import OverviewSection from './sections/OverviewSection';
import MenuSection from './sections/MenuSection';
import CategorySection from './sections/CategorySection';
import ItemSection from './sections/ItemSection';
import GroupOptionSection from './sections/GroupOptionSection';
import ApiService from '../../ApiService';

const MenuPage = ({ history }) => {
  const [curSection, setCurSection] = useState(CONSTANTS.MENU_OVERVIEW_SECTION);
  const [isCreateMenu, setIsCreateMenu] = useState('false');
  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    ApiService({
      method: 'POST',
      url: '/store/forMenuSelect',
      data: { search_str: '' },
      headers: {
        'Content-Type': 'application/json',
        ...CONSTANTS.getToken().headers,
      },
    })
      .then((res) => {
        if (res.data.success)
          setStoreList([
            ...res.data.stores.map((item) => {
              return { value: item.id, label: item.name };
            }),
          ]);
      })
      .catch((err) => {
        console.log(err);
        console.log('Loading store failed.');
      });
  }, []);

  return (
    <AppContainer>
      <MenuContainer>
        <TopSectionSelector
          curSection={curSection}
          setCurSection={(selected) => {
            setCurSection(selected);
            setIsCreateMenu(false);
          }}
        />
        <SectionContainer>
          {curSection === CONSTANTS.MENU_OVERVIEW_SECTION && (
            <OverviewSection
              gotoCreateMenu={() => {
                setIsCreateMenu(true);
                setCurSection(CONSTANTS.MENU_MENUS_SECTION);
              }}
            />
          )}
          {curSection === CONSTANTS.MENU_MENUS_SECTION && (
            <MenuSection isCreateMenu={isCreateMenu} storeList={storeList} />
          )}
          {curSection === CONSTANTS.MENU_CATEGORIES_SECTION && (
            <CategorySection />
          )}
          {curSection === CONSTANTS.MENU_ITEMS_SECTION && <ItemSection />}
          {curSection === CONSTANTS.MENU_GROUP_OPTIONS && (
            <GroupOptionSection />
          )}
        </SectionContainer>
      </MenuContainer>
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  padding: 0 31px;
`;

export default withRouter(MenuPage);
