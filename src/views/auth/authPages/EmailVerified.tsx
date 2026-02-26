import { Button } from 'flowbite-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  const isSuccess = status === 'success';

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleResend = () => {
    navigate('/auth/resend-verification');
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-white p-8 rounded shadow text-center flex flex-col items-center'>
        {isSuccess ? (
          <>
            <h1 className='text-2xl font-bold text-blue-900'>Email Verified Successfully!</h1>
            <p className='mt-2 text-gray-600'>You can now log in to your account.</p>
            <Button
              onClick={handleLogin}
              className='mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'
            >
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <h1 className='text-2xl font-bold text-red-800'>Email Verification Failed</h1>
            <p className='mt-2 text-gray-600'>The verification link is invalid or expired.</p>
            <Button
              onClick={handleResend}
              className='mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'
            >
              Resend Verification
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerified;