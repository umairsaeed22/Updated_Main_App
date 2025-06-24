import axios from 'axios';

const BASEURL = 'http://10.10.7.47:9081/api';


const instance = axios.create({
  baseURL: BASEURL,
});

export default instance;
