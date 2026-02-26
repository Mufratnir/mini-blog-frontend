import { Button, Label, TextInput, HelperText } from 'flowbite-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useUI } from 'src/axios/UIContext';
import { apiRequest } from 'src/axios/api';

const AuthResetPass = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loader, setLoader, setAlert, formErrors, setFormErrors } = useUI();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!password) errors.password = 'Password is required';
    else if (password.length < 6)
      errors.password = 'Password must be at least 6 characters';

    if (password !== passwordConfirmation)
      errors.password_confirmation = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoader(true);
    setFormErrors({});

    try {
      const response: any = await apiRequest({
        method: 'post',
        url: '/auth/reset-password',
        data: {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
        setLoader,
        setAlert,
      });

      
      if (response?.errors) {
        const formattedErrors: { [key: string]: string } = {};
        Object.keys(response.errors).forEach((key) => {
          formattedErrors[key] = response.errors[key][0];
        });
        setFormErrors(formattedErrors);
        return;
      }

      
      if (response?.message) {
        setAlert({
          type: 'success',
          message: response.message,
        });
      }

      setPassword('');
      setPasswordConfirmation('');
      setFormErrors({});

      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message:
          error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow sm:p-6 md:p-8 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reset Password</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <TextInput
          id="password"
          type="password"
          placeholder="Enter your password"
          color={formErrors.password ? 'failure' : 'gray'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {formErrors.password && (
          <HelperText color="failure">
            {formErrors.password}
          </HelperText>
        )}
      </div>

      <div className="mb-6">
        <Label htmlFor="password_confirmation">Confirm Password</Label>
        <TextInput
          id="password_confirmation"
          type="password"
          placeholder="Confirm your password"
          color={formErrors.password_confirmation ? 'failure' : 'gray'}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        {formErrors.password_confirmation && (
          <HelperText color="failure">
            {formErrors.password_confirmation}
          </HelperText>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loader}>
        {loader ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
    </div>
    </div>
  );
};

export default AuthResetPass;