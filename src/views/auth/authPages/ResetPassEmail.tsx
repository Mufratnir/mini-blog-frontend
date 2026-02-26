import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { useLocation } from 'react-router-dom';
import { useUI } from 'src/axios/UIContext';
import { apiRequest } from 'src/axios/api';

const ResetPassEmail = () => {

  const { state } = useLocation();
  const email = state?.email;

  const { setLoader, setAlert, loader } = useUI();

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleResetPassword = async () => {
    const response: any = await apiRequest({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
      setLoader,
      setAlert,
    });

    if (response?.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow text-center w-96">
        <h1 className="text-2xl font-bold text-blue-900">Reset your Password</h1>

        <p className="mt-3 text-gray-600"> Password Resest email send this email</p>

        <p className="font-semibold mt-1">{email}</p>

        {status === 'idle' && (
          <Button onClick={handleResetPassword} className="mt-5 w-full" disabled={loader}>
            {loader ? 'Sending...' : 'Send Reset Password Email'}
          </Button>
        )}

        {status === 'success' && (
          <p className="mt-5 text-green-600 font-semibold">
            Password Reset email sent successfully. Please check your inbox.
          </p>
        )}

        {status === 'error' && (
          <p className="mt-5 text-red-600 font-semibold">
            Failed to send Password Reset email. Try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassEmail;
