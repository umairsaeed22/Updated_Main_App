import instance from '.';

const loginUser = async (UserName, Password) => {
  const basicAuth = btoa('TB-DEV:c6a1906da009');

  const response = await instance.post(
    '/v1/User/Login',
    { UserName, Password },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  return response.data;
};

export {loginUser};

// const nodeLogin = async (email, password) => {
//   const response = await instance.post('login', {
//     email,
//     password,
//   });
//   return response.data;
// };

// export { nodeLogin };
