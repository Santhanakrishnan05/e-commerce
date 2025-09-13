import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../client/styles/index.css'
import App from './pages/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
