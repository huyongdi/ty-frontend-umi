import { useState, useCallback } from 'react'
export default function test() {
  const [user, setUser] = useState(null)
  const signin = useCallback((account, password) => {
    // signin implementation
    // setUser(user from signin API)
    setUser(100)
  }, [])
  const signout = useCallback(() => {
    // signout implementation
    // setUser(null)
    setUser(200)
  }, [])
  return {
    user,
    signin,
    signout
  }
}
