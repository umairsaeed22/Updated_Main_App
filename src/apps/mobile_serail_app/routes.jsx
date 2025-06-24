// src/routes.jsx
import { Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

// Handheld Pages
const DeviceEntry = lazy(() => import('./pages/HandHeld/EntryScreen/page'));
const ShipmentDetails = lazy(() => import('./pages/HandHeld/ShipmentDetails/Page'));
const ProductList = lazy(() => import('./pages/HandHeld/ProductList/Page'));
const SuccessScreen = lazy(() => import('./pages/HandHeld/FinalScreen/Page'));
const StartShiftHandHeld = lazy(() => import('./pages/HandHeld/StartShift/page'));
const ShiftDetails = lazy(() => import('./pages/HandHeld/ShiftDetails/page'));
const LoginPage = lazy(() => import('./pages/HandHeld/Login/page'));

// Desktop Pages
const Dashboard = lazy(() => import('./pages/DesktopScreens/Dashboard/page'));
const AddNew = lazy(() => import('./pages/DesktopScreens/AddSerial/page'));
const AddGrn = lazy(() => import('./pages/DesktopScreens/AddGrn/page'));
const PendingGrn = lazy(() => import('./pages/DesktopScreens/pendingGrns/page'));
const VerifySerialList = lazy(() => import('./pages/DesktopScreens/VerifySerialList/page'));
const VerifyArticle = lazy(() => import('./pages/DesktopScreens/VerifyArticle/page'));
const PoDetailPage = lazy(() => import('./components/PoDetailPage'));
const EcommerceOrder = lazy(() => import('./pages/DesktopScreens/EcommerceOrder/page'));
const ReportingDashboard = lazy(() => import('./pages/DesktopScreens/ReportingDashboard/page'));
const StartShift = lazy(() => import('./pages/DesktopScreens/startShift/page'));
const EndShift = lazy(() => import('./pages/DesktopScreens/EndShift/page'));
const OrderReturn = lazy(() => import('./pages/DesktopScreens/OrderReturn/page'));
const ShiftDetailPage = lazy(() => import('./pages/DesktopScreens/ShiftHistoryDetailPage/page'));
const ReportLanding = lazy(() => import('./pages/DesktopScreens/ReportingDashboard/reportLanding'));
const DownloadReport = lazy(() => import('./pages/DesktopScreens/DownloadReport/page'));

const routes = (
  <>
    {/* Handheld Routes */}
    <Route path="entryScreen" element={withSuspense(DeviceEntry)} />
    <Route path="shipment-details" element={withSuspense(ShipmentDetails)} />
    <Route path="product-list" element={withSuspense(ProductList)} />
    <Route path="success" element={withSuspense(SuccessScreen)} />
    <Route path="shift" element={withSuspense(StartShiftHandHeld)} />
    <Route path="shift-details" element={withSuspense(ShiftDetails)} />
    <Route path="/login" element={withSuspense(LoginPage)} />

    {/* Desktop Routes */}

    <Route index path="" element={withSuspense(Dashboard)} />
    <Route path="add-new" element={withSuspense(AddNew)} />
    <Route path="update-grn/:refNo" element={withSuspense(AddGrn)} />
    <Route path="pending-grn" element={withSuspense(PendingGrn)} />
    <Route path="verify-serial" element={withSuspense(VerifySerialList)} />
    <Route path="verify-article" element={withSuspense(VerifyArticle)} />
    <Route path="PO-details" element={withSuspense(PoDetailPage)} />
    <Route path="ecommerce-order" element={withSuspense(EcommerceOrder)} />
    <Route path="reporting-dashboard" element={withSuspense(ReportingDashboard)} />
    <Route path="start-shift" element={withSuspense(StartShift)} />
    <Route path="end-shift" element={withSuspense(EndShift)} />
    <Route path="order-return" element={withSuspense(OrderReturn)} />
    <Route path="Shift-detail-page" element={withSuspense(ShiftDetailPage)} />
    <Route path="reporting" element={withSuspense(ReportLanding)} />
    <Route path="download-report" element={withSuspense(DownloadReport)} />

  </>
);

export default routes;
