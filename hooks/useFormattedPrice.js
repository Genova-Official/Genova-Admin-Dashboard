import { useMemo } from 'react';

const useFormattedPrice = (price,  currency = 'USD') => {
  const formattedPrice = useMemo(() => {
    if (price !== undefined && price !== null) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(price);
    }
    return '';
  }, [price,  currency]);

  return formattedPrice;
};

export default useFormattedPrice;
