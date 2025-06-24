import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import './App.css';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from '../../components/security/ProtectedRoute';

const handheldPaths = [
  'entryScreen',
  'shipment-details',
  'product-list',
  'success',
  'shift',
  'shift-details',
  '/login', // keep slash as per your route
];

const MobileSerialApp = () => {
  return (
    <>
      <Routes>
        {routes.props.children.map((route, index) => {
          const path = route.props.path || '';
          const isHandheld = handheldPaths.includes(path);

          if (isHandheld) {
            return <Route key={index} {...route.props} />;
          }

          return (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoute
                  requiredRoles={['Rolesxxxxx']}
                  appId="AD29A92D-FAB1-4B2B-BB68-BAC4033D1710"
                >
                  {route.props.element}
                </ProtectedRoute>
              }
            />
          );
        })}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default MobileSerialApp;
