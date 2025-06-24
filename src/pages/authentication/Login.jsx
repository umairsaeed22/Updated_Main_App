import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import FormInput from '../../components/authentication/FormInput';
import { data, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../api/auth';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const [formInputs, setFormInputs] = useState({
    UserName: '',
    Password: '',
  });

  const { login } = useAuthStore();
  const { t } = useTranslation('global');
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate: loginOne } = useMutation({
    mutationKey: ['LOGIN'],
    mutationFn: ({ UserName, Password }) => loginUser(UserName, Password),
    onSuccess: (data) => {
      const { user, employee } = data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('employee', JSON.stringify(employee));
      if (data.status === 'Success') {
        login(data);
        toast.success('Login successful');
        navigate('/mainDashboard');
      } else {
        toast.error(data?.error?.message || 'Login failed');
      }
    },
    onError: (error) => {
      toast.error(`${error.response.data}`);
    },
  });

  // const { mutate } = useMutation({
  //   mutationKey: ['NODE_LOGIN'],
  //   mutationFn: () => nodeLogin(formInputs.UserName, formInputs.Password),
  //   onSuccess: (data) => {
  //     login(data);
  //     navigate('/mainDashboard');
  //     toast.success('success');
  //   },
  //   onError: (error) => {
  //     toast.error(`${error.response.data}`);
  //   },
  // });

  const handleFormSumittion = (e) => {
    e.preventDefault();
    if (!formInputs.UserName || !formInputs.Password) {
      return toast.error(t('EmptyInputsErrorMessage'));
    }
    loginOne({ UserName: formInputs.UserName, Password: formInputs.Password });
  };

  return (
    <div className="md:w-md md:h-fit w-full  bg-white md:border md:border-gray-200 md:rounded-lg md:shadow-md md:shadow-gray-300 md:p-6 p-4 flex flex-col items-center">
      <h1 className="text-primary-text font-rubik text-xl font-semibold mt-4">
        {t('Title')}
      </h1>
      <p className="text-sm text-center tracking-wide text-secondary-text mt-1">
        {t('SubTittle')}
      </p>
      <form
        onSubmit={handleFormSumittion}
        className=" w-full flex flex-col mt-16 "
      >
        <div className="w-full flex flex-col gap-1 relative">
          <FormInput
            name={'UserName'}
            type={'text'}
            value={formInputs.UserName}
            onInputChange={handleChange}
            label={t('EmailLabel')}
            placeholder={t('EmailPlaceholder')}
          />
        </div>
        <div className="w-full flex flex-col gap-1 relative mt-5">
          <FormInput
            name={'Password'}
            type={'password'}
            value={formInputs.Password}
            onInputChange={handleChange}
            label={t('PasswordLabel')}
            placeholder={t('PasswordPlaceholder')}
          />
        </div>
        <NavLink
          to="/forgot"
          className={`${theme === 'orange' ? 'text-blue-600' : 'text-indigo-600'
            } text-[0.830rem] mt-2 ${lang === 'en' ? 'ml-auto' : 'mr-auto'} `}
        >
          {t('Forgot')}
        </NavLink>
        <button
          type="submit"
          className={`p-2.5 ${theme === 'orange'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-button hover:bg-button-hover'
            } font-rubik font-semibold cursor-pointer transition-normal duration-300 mt-8 rounded-md text-white`}
        >
          {t('Login')}
        </button>
      </form>
    </div>
  );
};

export default Login;
