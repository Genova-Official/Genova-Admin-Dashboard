'use client';
import axios from 'axios';
import { SWRConfig } from 'swr'

const fetcher = async (...args) => {
    const res = await axios(...args);
    return res.data;
  };

export const SWRProvider = ({ children }) => {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
};