import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import DemandaPage from './pages/Demanda/index'
import IsLmPage from './pages/IS-LM/index'
import './index.css'

// Criamos um pequeno componente de Layout para não poluir o render
const App = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('demanda')

  return (
    <div className="app-wrapper">
      {/* Menu de Navegação Global */}
      <nav className="global-nav">
        <button 
          className={paginaAtiva === 'demanda' ? 'active' : ''} 
          onClick={() => setPaginaAtiva('demanda')}
        >
          Microeconomia (Demanda)
        </button>
        <button 
          className={paginaAtiva === 'islm' ? 'active' : ''} 
          onClick={() => setPaginaAtiva('islm')}
        >
          Macroeconomia (IS-LM)
        </button>
      </nav>

      {/* Renderização Condicional da Página */}
      <main className="content-container">
        {paginaAtiva === 'demanda' ? <DemandaPage /> : <IsLmPage />}
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)