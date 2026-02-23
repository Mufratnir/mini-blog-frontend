import { Button, Label, TextInput, HelperText } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUI } from 'src/axios/UIContext';
import { useState } from 'react';
import { apiRequest } from 'src/axios/api';

const AuthForgotPass = () => {
  const navigate = useNavigate();
  const { loader, setLoader, setAlert, formErrors, setFormErrors } = useUI();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormErrors({});
    setAlert(null);

    setLoader(true);

    try {
      const response: any = await apiRequest({
        method: 'post',
        url: '/auth/forgot-password',
        data: { email },
        setLoader,
        setAlert,
      });

      // 🔴 Backend validation error
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

      // ✅ Success handled by apiRequest alert
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label htmlFor="email">Email</Label>
            </div>

            <TextInput
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color={formErrors.email ? 'failure' : 'gray'}
              disabled={loader}
            />

            {formErrors.email && <HelperText color="failure">{formErrors.email}</HelperText>}
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full bg-primary text-white"
            disabled={loader}
          >
            {loader ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForgotPass;
