import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, label } from 'react-bootstrap';
import AppContainer from '../../../components/AppContainer';
import AddCategoryModal from './AddCategoryModal';
import CategoryCard from './CategoryCard/index';
import Switch from '../../../../sharedComponents/SwitchButton';

import { getCategoryListAction } from '../../../actions/categoryAction';
import { getMenuListAction } from '../../../actions/menuAction';

const EditMenuPage = ({ match, getCategoryListAction, getMenuListAction }) => {
  const menuId = match.params.id;
  const [isShowAll, setIsShowAll] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const { loaded, categoryList, menuListLoaded, menuList } = useSelector(
    (state) => ({
      loaded: state.categoryReducer.listLoaded,
      categoryList: state.categoryReducer.list,
      menuListLoaded: state.menuReducer.listLoaded,
      menuList: state.menuReducer.list,
    })
  );
  useEffect(() => {
    if (!menuListLoaded) getMenuListAction();
    if (!loaded) getCategoryListAction(menuId);
  }, []);

  const getMenuName = () => {
    const filterOne = menuList.filter((item) => item.id === parseInt(menuId));
    if (filterOne.length > 0) return filterOne[0].name;
    return 'Default Menu';
  };

  return (
    <AppContainer>
      <div className="main-screen">
        <div className="main-container">
          <div className="top-section">
            <h3>
              Menu: <span className="text-primary">{getMenuName()}</span>
            </h3>
            <div className="control-div">
              <label className="mr-1 mb-0 ml-auto  align-self-center">
                Show / Hide All
              </label>
              <Switch
                inputId="MenuShowAll"
                isOn={isShowAll}
                handleToggle={() => setIsShowAll(!isShowAll)}
              />
            </div>
          </div>
          {categoryList.map((item) => {
            return (
              <CategoryCard
                categoryInfo={item}
                key={item.id}
                menuId={menuId}
                isShowAll={isShowAll}
              />
            );
          })}
          <Button
            className="align-self-start mt-2"
            onClick={() => setShowAddCategory(true)}
          >
            Add Category
          </Button>

          <AddCategoryModal
            isShow={showAddCategory}
            hideModal={() => setShowAddCategory(false)}
            menuId={menuId}
            modalInfo={{ id: -1, name: '', description: '' }}
          />
        </div>
      </div>
    </AppContainer>
  );
};

export default withRouter(
  connect(null, { getCategoryListAction, getMenuListAction })(EditMenuPage)
);
