import { createContext } from 'react'

export const urlContext = createContext()

const UrlContext = ({ children }) => {
  const url = 'http://localhost:4000'
  return <urlContext.Provider value={{ url }}>{children}</urlContext.Provider>
}

export default UrlContext
