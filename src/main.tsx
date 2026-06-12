import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UnitsProvider } from './context/UnitsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnitsProvider>
      <App />
    </UnitsProvider>
  </StrictMode>,
)
