export default {
  store: {
    list: [],
    listLoaded: false,
  },
  menu: {
    list: [],
    listLoaded: false,
  },
  category: {
    list: [],
    listLoaded: false,
  },
  order: {
    newOrderCount: 0,
    storeId: -1,
    unreadOrder: [],
  },
  storeFront: {
    store: {},
    menu: {
      categories: [],
    },
    orderList: [],
    deliveryData: {
      type: -1,
      storeName: '',
      postcode: '',
      address: '',
    },
    storeList: [],
    payment: {
      error: '',
      paymentMethodsRes: null,
      paymentRes: null,
      paymentDetailsRes: null,
      config: {
        paymentMethodsConfiguration: {
          ideal: {
            showImage: true,
          },
          card: {
            hasHolderName: false,
            holderNameRequired: true,
            name: 'Credit or debit card',
            amount: {
              value: 0, // 10€ in minor units
              currency: 'GBP',
            },
          },
        },
        locale: 'en_GB',
        showPayButton: true,
      },
    },
    user: {},
  },
  user: {
    user: {},
    token: '',
  },
  sidebar: {
    collapse: false,
  },
};
