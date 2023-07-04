import React, { Suspense, lazy } from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

import PrivateRoute from '../routes/privateRoute';
import HtSpinner from 'admin/components/HtSpinner';
const LoginPage = lazy(() => import('../admin/pages/login'));
const RegisterPage = lazy(() => import('../admin/pages/register'));
const DashboardPage = lazy(() => import('../admin/pages/dashboard'));
const StorePage = lazy(() => import('../admin/pages/store'));

const MenuOverviewPage = lazy(() =>
  import('../admin/pages/menu/sections/OverviewSection')
);
const MenuListPage = lazy(() =>
  import('../admin/pages/menu/sections/MenuSection/MenuList')
);
const MenuEditPage = lazy(() =>
  import('../admin/pages/menu/sections/MenuSection/EditMenu')
);
const CategoryListPage = lazy(() =>
  import('../admin/pages/menu/sections/CategorySection/CategoryList')
);
const CategoryEditPage = lazy(() =>
  import('../admin/pages/menu/sections/CategorySection/CategoryEdit')
);
const ItemListPage = lazy(() =>
  import('../admin/pages/menu/sections/ItemSection/ItemList')
);
const ItemEditPage = lazy(() =>
  import('../admin/pages/menu/sections/ItemSection/ItemEdit')
);
const GroupListPage = lazy(() =>
  import('../admin/pages/menu/sections/GroupOptionSection/GroupOptionList')
);
const GroupEditPage = lazy(() =>
  import('../admin/pages/menu/sections/GroupOptionSection/GroupOptionEdit')
);
const OrderPage = lazy(() => import('../admin/pages/order'));
const SettingPage = lazy(() => import('../admin/pages/settings'));
const PaymentPage = lazy(() => import('../admin/pages/settings/pages/Payment'));
const PaymentAccountPage = lazy(() =>
  import('../admin/pages/settings/pages/PaymentAccount')
);
const IdentificationCheckPage = lazy(() =>
  import('../admin/pages/settings/pages/IdentificationCheck')
);
const PayoutSchedulePage = lazy(() =>
  import('../admin/pages/settings/pages/PayoutSchedule')
);
const TransactionHistoryPage = lazy(() =>
  import('../admin/pages/settings/pages/TransactionHistory')
);
const TransactionDetailPage = lazy(() =>
  import('../admin/pages/settings/pages/TransactionDetail')
);
const PayoutSettingPage = lazy(() =>
  import('../admin/pages/settings/pages/PayoutSetting')
);

const CustomerPrivateRoute = lazy(() =>
  import('../routes/customerPrivateRoute')
);
const SearchStorePage = lazy(() => import('../storeFront/pages/searchStore'));
const StoreListPage = lazy(() => import('../storeFront/pages/storeList'));
const StoreFrontPage = lazy(() => import('../storeFront/pages/storeFront'));
const CheckoutPayPage = lazy(() =>
  import('../storeFront/pages/storeFront/components/CheckoutPay')
);
const DeliverToMePage = lazy(() => import('../storeFront/pages/deliverToMe'));
const ConfirmOrderPage = lazy(() => import('../storeFront/pages/confirmOrder'));
const HomePage = lazy(() => import('../storeFront/pages/home'));
const FoodTypeCityPage = lazy(() => import('../storeFront/pages/foodtypeCity'));
const FoodTypeNearmeLanding = lazy(() =>
  import('../storeFront/pages/foodtypeNearmeLanding')
);
const FoodTypeLandingPage = lazy(() =>
  import('../storeFront/pages/foodtypeLanding')
);
const TermsConditionPage = lazy(() => import('../storeFront/pages/terms'));
const PrivacyPolicyPage = lazy(() =>
  import('../storeFront/pages/privacyPolicy')
);
const LegalPage = lazy(() => import('../storeFront/pages/legal'));
const RegisterRestaurantPage = lazy(() =>
  import('../storeFront/pages/registerRestaurant')
);
const CustomerAdminPage = lazy(() =>
  import('../storeFront/pages/customerAdmin')
);
const ResetPasswordPage = lazy(() =>
  import('../storeFront/pages/resetPassword')
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<HtSpinner />}>
        <Switch>
          {/* Admin Pages */}
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />

          <PrivateRoute exact path="/dashboard" component={DashboardPage} />
          <PrivateRoute exact path="/stores" component={StorePage} />
          <PrivateRoute
            exact
            path="/menus/overview"
            component={MenuOverviewPage}
          />
          <PrivateRoute exact path="/menus/list" component={MenuListPage} />
          <PrivateRoute exact path="/menus/edit/:id" component={MenuEditPage} />
          <PrivateRoute
            exact
            path="/menus/categories"
            component={CategoryListPage}
          />
          <PrivateRoute
            exact
            path="/menus/category/:id"
            component={CategoryEditPage}
          />
          <PrivateRoute exact path="/menus/items" component={ItemListPage} />
          <PrivateRoute exact path="/menus/item/:id" component={ItemEditPage} />
          <PrivateRoute exact path="/menus/groups" component={GroupListPage} />
          <PrivateRoute
            exact
            path="/menus/group/:id"
            component={GroupEditPage}
          />
          <PrivateRoute exact path="/orders" component={OrderPage} />
          <PrivateRoute exact path="/settings" component={SettingPage} />
          <PrivateRoute
            exact
            path="/settings/payments"
            component={PaymentPage}
          />
          <PrivateRoute
            exact
            path="/settings/payment/account"
            component={PaymentAccountPage}
          />
          <PrivateRoute
            exact
            path="/settings/payment/identification-check"
            component={IdentificationCheckPage}
          />
          <PrivateRoute
            exact
            path="/settings/payment/payout-schedule"
            component={PayoutSchedulePage}
          />
          <PrivateRoute
            exact
            path="/settings/payment/payout-setting"
            component={PayoutSettingPage}
          />
          <PrivateRoute
            exact
            path="/settings/payment/transactions"
            component={TransactionHistoryPage}
          />
          <PrivateRoute
            exact
            path="/settings/payment/transaction/detail"
            component={TransactionDetailPage}
          />

          {/* Store Front Pages */}
          <Route
            exact
            path="/merchant-signup"
            component={RegisterRestaurantPage}
          />
          <Route exact path="/takeaway/:city" component={FoodTypeCityPage} />
          <Route
            exact
            path="/takeaway/nearme/:foodtype"
            component={FoodTypeNearmeLanding}
          />
          <Route
            exact
            path="/takeaway/:city/:foodtype"
            component={FoodTypeLandingPage}
          />
          <CustomerPrivateRoute
            exact
            path="/customer/admin"
            nextLink="/"
            component={CustomerAdminPage}
          />
          <Route exact path="/store/search" component={SearchStorePage} />
          <Route exact path="/store/list" component={StoreListPage} />
          <Route exact path="/:id/menu" component={StoreFrontPage} />
          <Route exact path="/checkout/pay" component={CheckoutPayPage} />
          <Route exact path="/deliver-to-me" component={DeliverToMePage} />

          <Route exact path="/terms" component={TermsConditionPage} />
          <Route
            exact
            path="/confirm-order/:menuId/:confirmId"
            component={ConfirmOrderPage}
          />

          <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route exact path="/legal" component={LegalPage} />
          <Route
            exact
            path="/resetpassword/:token"
            component={ResetPasswordPage}
          />

          {/* Customer Admin Page */}
          <CustomerPrivateRoute
            exact
            path="/customer/admin"
            nextLink="/"
            component={CustomerAdminPage}
          />
          <Route path="/:str">
            <Redirect to="/" />
          </Route>

          {Capacitor.isNative ? (
            <Route exact path="/" component={DashboardPage} />
          ) : (
            <Route exact path="/" component={HomePage} />
          )}
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
