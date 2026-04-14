import client from './client';

export const getPatients = async () => {
  const { data } = await client.get('/patients');
  return data;
};

export const getMyProfile = async () => {
  const { data } = await client.get('/patients/me');
  return data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await client.put('/patients/me', payload);
  return data;
};
