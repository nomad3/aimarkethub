import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import { theme } from './theme'
import { ThemeProvider } from './components/ThemeContext'  // Si usas context
import Spinner from './components/Spinner'  // Componente base

// Configuración global de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutos
      refetchOnWindowFocus: false,
    }
  }
})

// Proveedores de contexto y temas
const Root = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider value={theme}>
      <App />
      <Spinner global />  {/* Spinner global para cargas */}
    </ThemeProvider>
  </QueryClientProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)