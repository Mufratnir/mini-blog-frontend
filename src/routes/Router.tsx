// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import Categories from 'src/views/Pages/dashboards/Categories';
import User from 'src/views/Pages/dashboards/User';
import Home from 'src/views/Pages/Home';
import EmailVerified from 'src/views/auth/authPages/EmailVerified';
import ForgotPass from 'src/views/auth/authPages/ForgotPass';
import ResetPass from 'src/views/auth/authPages/ResetPass';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../views/Pages/dashboards/Dashboard')));

// authentication
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));
import VerifyEmail from '../views/auth/authPages/VerifyEmail';
import ResetPassEmail from 'src/views/auth/authPages/ResetPassEmail';

/* ================= AUTH CHECK ================= */

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/auth/login" />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

/* ================= ROUTES ================= */

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/categories',
        element: (
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        ),
      },
      {
        path: '/user',
        element: (
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/home', element: <Home /> },
      {
        path: '/auth/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/auth/register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: '/auth/email-verified',
        element: (
          <PublicRoute>
            <EmailVerified />
          </PublicRoute>
        ),
      },
      {
        path: '/auth/verify-email',
        element: (
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        ),
      },
      {
        path: '/auth/reset-passemail',
        element: (
          <PublicRoute>
            <ResetPassEmail />
          </PublicRoute>
        ),
      },
      {
        path: '/auth/forgot-password',
        element: (
          <PublicRoute>
            <ForgotPass />
          </PublicRoute>
        ),
      },
      {
        path: '/auth/reset-password',
        element: (
          <PublicRoute>
            <ResetPass />
          </PublicRoute>
        ),
      },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
