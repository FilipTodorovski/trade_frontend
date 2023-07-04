export const getAdminToken = () => {
  return localStorage.getItem('token');
};

export const getCustomerToken = () => {
  return localStorage.getItem('customer-token');
};
