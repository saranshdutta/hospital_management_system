import client from './client';

export const getMedicines = async () => {
  const { data } = await client.get('/medicines');
  return data;
};

export const getMedicine = async (id) => {
  const { data } = await client.get(`/medicines/${id}`);
  return data;
};

export const createMedicine = async (payload) => {
  const { data } = await client.post('/medicines', payload);
  return data;
};

export const updateMedicine = async (id, payload) => {
  const { data } = await client.put(`/medicines/${id}`, payload);
  return data;
};

export const deleteMedicine = async (id) => {
  await client.delete(`/medicines/${id}`);
};
