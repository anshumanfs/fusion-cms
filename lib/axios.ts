import axois from 'axios';
import ConfigJson from '../server/config.json';

const axios = axois.create({
  baseURL: `${ConfigJson.DEPLOYMENT_URL}/appManager`,
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

export default axios;
