import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UrlContext from './components/UrlContext.jsx'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UrlContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UrlContext>
  </React.StrictMode>
)
