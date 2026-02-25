// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import  { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import Categories from 'src/views/Pages/dashboards/Categories';
import User from 'src/views/Pages/dashboards/User';
import Home from 'src/views/Pages/Home';
import EmailVerified from 'src/views/auth/authforms/EmailVerified';
import ForgotPass from 'src/views/auth/authforms/ForgotPass';
import ResetPass from 'src/views/auth/authforms/ResetPass';



/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../views/Pages/dashboards/Dashboard')));


// authentication
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));


const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/categories', exact: true, element: <Categories /> },
      { path: '/user', exact: true, element: <User /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/home', exact: true, element: <Home /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/email-verified', element: <EmailVerified /> },
      { path: '/auth/forgot-password', element: <ForgotPass /> },
      { path: '/auth/reset-password', element: <ResetPass /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router)

export default router;
