import { createContext } from 'react'

export const urlContext = createContext()

const UrlContext = ({ children }) => {
  const url = 'https://lasha-blog-api.onrender.com/'
  return <urlContext.Provider value={{ url }}>{children}</urlContext.Provider>
}

export default UrlContext
