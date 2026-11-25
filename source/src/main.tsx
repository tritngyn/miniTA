import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { DemoProvider } from './data/store';
import { theme } from './theme';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DemoProvider>
          <App />
        </DemoProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
