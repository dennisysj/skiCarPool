import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import login from './login-form.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <login />
  </StrictMode>,
)
