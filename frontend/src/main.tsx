import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// React 앱 진입점: root 엘리먼트에 마운트
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
