import { useMemo } from 'react';

const useFormattedPrice = (price, locale = 'en-US', currency = 'USD') => {
  const formattedPrice = useMemo(() => {
    if (price !== undefined && price !== null) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(price);
    }
    return '';
  }, [price, locale, currency]);

  return formattedPrice;
};

export default useFormattedPrice;
