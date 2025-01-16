import React from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import '../tailwind.css'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)