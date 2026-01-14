// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// import App from './App.tsx'
import Navbar from './components/Navbar'
import AppRouter from './routes/AppRouter'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Navbar />
    <AppRouter />
  </BrowserRouter>
)
