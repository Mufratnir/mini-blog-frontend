import { Button, Label, TextInput, HelperText } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from 'src/axios/UIContext';
import { useState } from 'react';
import { apiRequest } from 'src/axios/api';

const AuthResetPassEmail = () => {
  const navigate = useNavigate();
  const { loader, setLoader, setAlert, formErrors, setFormErrors } = useUI();
  const [emailInput, setEmailInput] = useState('');

  const handleResetPassword = async () => {
    setFormErrors({});
    setAlert(null);

    setLoader(true);

    try {
      const response: any = await apiRequest({
        method: 'post',
        url: '/auth/reset-password-email',
        data: { email: emailInput },
        setLoader,
        setAlert,
      });

      if (response?.errors) {
        if (response.errors?.errors) {
          const formattedErrors: { [key: string]: string } = {};
          Object.keys(response.errors.errors).forEach((key) => {
            formattedErrors[key] = response.errors.errors[key][0];
          });
          setFormErrors(formattedErrors);
        }
        return;
      }

      if (response?.success) {
        setAlert({
          type: 'success',
          message: 'Reset password email sent successfully.',
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error?.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow sm:p-6 md:p-8 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reset Password Email</h2>

        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email">Email</Label>
          </div>

          <TextInput
            id="email"
            type="email"
            required
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            color={formErrors.email ? 'failure' : 'gray'}
            disabled={loader}
          />

          {formErrors.email && <HelperText color="failure">{formErrors.email}</HelperText>}
        </div>

        <Button
          onClick={handleResetPassword}
          color="primary"
          className="w-full bg-primary text-white"
          disabled={loader}
        >
          {loader ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </div>
    </div>
  );
};

export default AuthResetPassEmail;
