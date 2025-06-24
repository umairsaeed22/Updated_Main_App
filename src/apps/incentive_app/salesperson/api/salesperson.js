import instance from '.';

const getSalespersonData = async (period) => {
  const response = await instance.get(`/salesperson/${period}`);

  return response.data;
};

export { getSalespersonData };
