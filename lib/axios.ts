import axois from 'axios';
import ConfigJson from '../config.json';

const axios = axois.create({
  baseURL: `${ConfigJson.DEPLOYMENT_URL}/appManager`,
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth?tab=login';
      }
      const data = JSON.stringify({
        query: `mutation RefreshToken($refreshToken: String!) {
          requestNewToken(refreshToken: $refreshToken) {
            token
            refreshToken
          }
        }`,
        variables: {
          refreshToken,
        },
      });
      axios
        .post('/appManager', data)
        .then((res) => {
          const { data, errors } = res.data;
          if (errors) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth?tab=login';
            return;
          }
          localStorage.setItem('token', data.requestNewToken.token);
          localStorage.setItem('refreshToken', data.requestNewToken.refreshToken);
          return axios(error.config);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth?tab=login';
        });
    }
    return Promise.reject(error);
  }
);

export default axios;
