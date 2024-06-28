import axios from 'axios';

const API_URL = '';

const accessValue = 123
export default function init() {
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = false;

  if (accessValue) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessValue}`;
  }
  
}