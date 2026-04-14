import client from './client';

export const getHospitals = async () => {
  const { data } = await client.get('/hospitals');
  return data;
};

export const createHospital = async (payload) => {
  const { data } = await client.post('/hospitals', payload);
  return data;
};
