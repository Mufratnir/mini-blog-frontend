import { Button, Label, TextInput, HelperText } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { apiRequest } from '../../../axios/api';
import { useUI } from '../../../axios/UIContext';

const AuthLogin = () => {
  const navigate = useNavigate();
  const { setLoader, setAlert, formErrors, setFormErrors } = useUI();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setLoader(true);

    try {
      const response: any = await apiRequest({
        method: 'post',
        url: '/auth/login',
        data: formData,
        setLoader,
        setAlert,
      });
      console.log( response);
      if (response?.errors) {
        const errors: { [key: string]: string } = {};
        Object.keys(response.errors).forEach((key) => {
          errors[key] = response.errors[key][0];
        });
        setFormErrors(errors);
        return;
      }

      if (response?.data.token) {
        localStorage.setItem('auth', JSON.stringify({ token: response.data.token }));
        setAlert({ type: 'success', message: response.message || 'Login successful' });
        navigate('/home');
      } else {
        setAlert({ type: 'error', message: response.message || 'Login failed' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Something went wrong' });
    } finally {
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={handleChange}
          color={formErrors.email ? 'failure' : undefined}
        />
        {formErrors.email && <HelperText color="failure">{formErrors.email}</HelperText>}
      </div>

      <div className="mb-4">
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          name="password"
          type="password"
          placeholder="Enter Your Password"
          value={formData.password}
          onChange={handleChange}
          color={formErrors.password ? 'failure' : undefined}
        />
        {formErrors.password && <HelperText color="failure">{formErrors.password}</HelperText>}
      </div>

      <div className="flex justify-between my-5">
        <Button type="submit" color={'primary'} className="w-full bg-primary text-white">
          Login
        </Button>
      </div>
    </form>
  );
};

export default AuthLogin;
