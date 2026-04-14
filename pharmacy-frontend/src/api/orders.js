import client from './client';

export const getOrders = async () => {
  const { data } = await client.get('/orders');
  return data;
};

/**
 * @param {Array<{medicine_id: number, quantity: number}>} items
 */
export const placeOrder = async (items) => {
  const { data } = await client.post('/orders', { items });
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await client.put(`/orders/${orderId}/status`, { status });
  return data;
};
