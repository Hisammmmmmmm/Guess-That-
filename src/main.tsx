import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Une erreur inattendue est survenue" fallbackMessage="Cliquez sur le bouton ci-dessous pour recharger l'application.">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
