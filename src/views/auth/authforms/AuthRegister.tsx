import { Button, Label, TextInput, HelperText } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useUI } from 'src/axios/UIContext';
import { apiRequest } from 'src/axios/api';

const AuthRegister = () => {
  const navigate = useNavigate();
  const { loader, setLoader, setAlert, formErrors, setFormErrors } = useUI();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!username) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (password !== passwordConfirmation) errors.password_confirmation = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoader(true);
    setFormErrors({});

    const data = {
      name: username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      const response: any = await apiRequest({
        method: 'post',
        url: '/auth/register',
        data,
        setLoader,
        setAlert,
      });

      // ✅ Backend validation errors
      if (response?.errors) {
        const formattedErrors: { [key: string]: string } = {};
        Object.keys(response.errors).forEach((key) => {
          formattedErrors[key] = response.errors[key][0];
        });
        setFormErrors(formattedErrors);
        return;
      }

      // ✅ Backend success or other message
      if (response?.message) {
        setAlert({
          type: 'success',
          message: response.message, // backend message show করবে
        });
      }

      if (response?.user) {
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setFormErrors({});
        navigate('/');
      }
    } catch (error: any) {
      // ✅ যদি backend 500 বা unexpected error দেয়
      setAlert({
        type: 'error',
        message: error?.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="username" value="Username" />
        <TextInput
          id="username"
          type="text"
          placeholder="Your username"
          color={formErrors.name ? 'failure' : 'gray'}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {formErrors.name && <HelperText color="failure">{formErrors.name}</HelperText>}
      </div>

      <div className="mb-4">
        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          placeholder="Your email"
          color={formErrors.email ? 'failure' : 'gray'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {formErrors.email && <HelperText color="failure">{formErrors.email}</HelperText>}
      </div>

      <div className="mb-4">
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          type="password"
          placeholder="Your password"
          color={formErrors.password ? 'failure' : 'gray'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {formErrors.password && <HelperText color="failure">{formErrors.password}</HelperText>}
      </div>

      <div className="mb-6">
        <Label htmlFor="password_confirmation" value="Confirm Password" />
        <TextInput
          id="password_confirmation"
          type="password"
          placeholder="Confirm your password"
          color={formErrors.password_confirmation ? 'failure' : 'gray'}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        {formErrors.password_confirmation && (
          <HelperText color="failure">{formErrors.password_confirmation}</HelperText>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loader}>
        {loader ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default AuthRegister;
