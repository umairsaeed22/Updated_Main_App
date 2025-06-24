import axios from 'axios';

const BASE_URL = 'https://nodeserver-h3xh.onrender.com/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;
