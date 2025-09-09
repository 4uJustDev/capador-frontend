import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/app';

//TODO: Надо будет удалить перед релизом
if (import.meta.env.DEV) {
  (window as any).__ENV__ = import.meta.env;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
