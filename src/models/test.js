import { useState, useCallback } from 'react';
export default function test() {
  const [user, setUser] = useState(null);
  const signin = useCallback((account, password) => {
    fetch('abc');
    setUser(100);
  }, []);
  const signout = useCallback(() => {
    setUser(200);
  }, []);
  return {
    user,
    signin,
    signout,
  };
}
