import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import { GamificationProvider } from './context/GamificationContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <GamificationProvider>
        <App />
      </GamificationProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
