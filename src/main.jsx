import { createRoot } from 'react-dom/client'
import './index.css'
import ReporteConfigPage from './components/ReporteConfigPage'
import HomePage from './components/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/configurar-reporte" element={<ReporteConfigPage />} />
    </Routes>
  </BrowserRouter>
)
