
import { mutate } from 'swr';
import { useState } from 'react';
import axios from 'axios';
import { handleGenericError } from './errorHandler';

const useCrud = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Generic handler for all requests
  const handleRequest = async (requestFn, requestData = null) => {
    try {
      const response = await requestFn(requestData);
      setResponse(response.data);
      mutate(url); // Revalidate the GET request data
      return response.data;
    } catch (error) {
      const err = handleGenericError(error);
      setError(err);
    }
  };

  // POST request
  const postData = (postData) => handleRequest((data) => axios.post(url, data), postData);

  // GET request

  // PUT request
  const putData = (putData) => handleRequest((data) => axios.put(url, data), putData);

  // DELETE request
  const deleteData = (deleteId) => handleRequest(() => axios.delete(`${url}/${deleteId}`));

  return {
    response,
    error,
    postData,
    putData,
    deleteData, 
  };
};

export default useCrud;
