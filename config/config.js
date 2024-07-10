import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log(API_URL)
// const accessCookie = document.cookie
//   .split("; ")
//   .find((row) => row.startsWith("gen_token"));

// const accessValue = accessCookie ? accessCookie.split("=")[1] : null;

export default function init() {
  if (typeof window !== 'undefined') {
    // This code will only run in the browser
    const accessCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("gen_token"));
      
    const accessValue = accessCookie ? accessCookie.split("=")[1] : null;
console.log(accessValue)
    axios.defaults.baseURL = API_URL;
    axios.defaults.withCredentials = false;

    if (accessValue) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessValue}`;
    }
  }
  
}