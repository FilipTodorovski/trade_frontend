export const getGroupItemPrice = (itemInfo, groupId, itemId) => {
  const filteredOne = itemInfo.group.filter((group) => group.id === groupId);
  if (filteredOne.length === 0) return 0;
  const filteredItem = filteredOne[0].items_info.filter(
    (item) => item.id === itemId
  );
  if (filteredItem.length === 0) return 0;
  return parseFloat(filteredItem[0].price);
};

export const getGroupItemName = (itemInfo, groupId, itemId) => {
  const filteredOne = itemInfo.group.filter((group) => group.id === groupId);
  if (filteredOne.length === 0) return 0;
  const filteredItem = filteredOne[0].item.filter((item) => item.id === itemId);
  if (filteredItem.length === 0) return 0;
  return filteredItem[0].name;
};
