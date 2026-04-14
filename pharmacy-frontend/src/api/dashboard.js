import client from './client';

export const getAdminStats = async () => {
  const { data } = await client.get('/admin/stats');
  return data;
};
