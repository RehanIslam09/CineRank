import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { MoodProvider } from './context/MoodContext';
import { WatchlistProvider } from './context/WatchlistContext';

createRoot(document.getElementById('root')).render(
  <MoodProvider>
    <WatchlistProvider>
      <App />
    </WatchlistProvider>
  </MoodProvider>,
);
