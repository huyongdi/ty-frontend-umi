import { useState, useEffect } from 'react';

export default () => {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    return () => {};
  });

  return isOnline;
};
