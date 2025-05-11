import { BrowserRouter } from 'react-router-dom'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/ThemeProvider.tsx"
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider as AntdThemeProvider } from 'antd-style';
import { useTheme } from '@/components/ThemeProvider.tsx';



import './index.css'
import App from './App.tsx'

function Root() { // Componente que aplica el tema de Ant Design dinámicamente
  const { theme } = useTheme(); // Obtengo el tema actual ('light' o 'dark')
  return (
    <AntdThemeProvider appearance={theme}>
      <App />
    </AntdThemeProvider>
  );
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Root />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode >,
)
