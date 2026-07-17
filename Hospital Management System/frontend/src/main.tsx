import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 1) The toolkit's component styles. These REFERENCE design tokens but don't
//    define them, so on their own components look unstyled/transparent.
import '@msbc/react-toolkit/dist/index.css';
// 2) The design tokens the toolkit expects (colors, spacing, fonts, radii).
//    This is what actually themes every component + the AG-Grid table.
import './styles/tokens.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Apply the saved theme before first paint (default light).
if (localStorage.getItem('hms-theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
