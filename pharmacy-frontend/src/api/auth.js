import client from './client';

/**
 * Login — returns { access_token, user }
 */
export const loginApi = async (email, password) => {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
};

/**
 * Signup — returns { access_token, user }
 */
export const signupApi = async (name, email, password) => {
  const { data } = await client.post('/auth/signup', { name, email, password });
  return data;
};
