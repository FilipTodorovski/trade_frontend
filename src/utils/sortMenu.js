import _ from 'lodash';

export const sortMenuData = (menuData) => {
  let menuDataTemp = {};
  let categories = [];
  // format category & item
  menuData.order_info.forEach((itemCategory) => {
    const filteredCategory = menuData.category.filter(
      (itemCategoryOne) =>
        parseInt(itemCategoryOne.id) === parseInt(itemCategory.id)
    );
    if (
      filteredCategory.length > 0 &&
      filteredCategory[0].item &&
      filteredCategory[0].item.length > 0
    ) {
      filteredCategory[0].item = [
        ...getOrderedItem(
          menuData.order_info,
          filteredCategory[0].id,
          filteredCategory[0].item
        ),
      ];
    }

    if (filteredCategory.length > 0)
      categories.push({
        ...itemCategory,
        collapsed: true,
        category: filteredCategory[0],
      });
  });

  // format group;
  categories = categories.map((category) => {
    const itemTemp = category.category.item.map((itemOne) => {
      const itemOneTemp = { ...itemOne };
      itemOneTemp.groups_info = [
        ...getOrderedGroup(
          menuData.order_info,
          parseInt(category.id),
          parseInt(itemOne.id),
          itemOne
        ),
      ];
      return itemOneTemp;
    });

    return {
      ...category,
      category: {
        ...category.category,
        item: itemTemp,
      },
    };
  });

  menuDataTemp = {
    categories,
  };
  return menuDataTemp;
};

export const getOrderedItem = (order_info, categoryId, itemList) => {
  let item_order = [];
  const filteredOne = order_info.filter(
    (item) => parseInt(item.id) === categoryId
  );
  item_order = _.get(filteredOne[0], 'item', null);

  const returnItemList = [];
  if (item_order && item_order.length > 0) {
    const maxOrder = Math.max.apply(
      Math,
      item_order.map(function (o) {
        return parseInt(o.order);
      })
    );
    let newValue = 0;
    itemList.forEach((itemEach) => {
      const filterItem = item_order.filter(
        (itemFilter) => parseInt(itemFilter.id) === itemEach.id
      );
      let order = 0;
      if (filterItem.length > 0) {
        order = parseInt(filterItem[0].order);
      } else {
        order = maxOrder + newValue;
        newValue++;
      }
      returnItemList.push({
        ...itemEach,
        order,
        collapsed: true,
      });
    });

    return returnItemList;
  }
  return itemList.map((item, nIndex) => {
    return { ...item, order: nIndex, collapsed: true };
  });
};

export const getOrderedGroup = (order_info, categoryId, itemId, groupInfo) => {
  if (!groupInfo || groupInfo.length === 0) return [];
  const group_infoTemp = groupInfo.group.map((item) => {
    const filteredOne = groupInfo.groups_info.filter(
      (itemOne) => parseInt(itemOne.id) === item.id
    );

    if (filteredOne.length > 0)
      return {
        ...filteredOne[0],
        group: { ...item },
        collapsed: true,
      };

    return;
  });

  const filteredOne = order_info.filter(
    (item) => parseInt(item.id) === categoryId
  );
  if (
    filteredOne.length === 0 ||
    !filteredOne[0].item ||
    filteredOne[0].item.length === 0
  )
    return group_infoTemp;

  const filteredItem = filteredOne[0].item.filter(
    (item) => parseInt(item.id) === itemId
  );
  if (
    filteredItem.length === 0 ||
    !filteredItem[0].group ||
    filteredItem[0].group.length === 0
  )
    return group_infoTemp;

  let maxOrder = Math.max.apply(
    Math,
    filteredItem[0].group.map(function (o) {
      return parseInt(o.order);
    })
  );

  const returnGroupInfo = [];
  group_infoTemp.forEach((item) => {
    // filter if group already ordered on the Menu
    const filteredGroup = filteredItem[0].group.filter(
      (itemOne) => itemOne.id === parseInt(item.id)
    );

    if (filteredGroup.length > 0) {
      returnGroupInfo.push({
        ...filteredGroup[0],
        collapsed: true,
        group: { ...item.group },
      });
    } else {
      maxOrder++;
      returnGroupInfo.push({
        id: item.group.id,
        order: maxOrder,
        collapsed: true,
        group: { ...item.group },
      });
    }
  });

  return returnGroupInfo;
};
