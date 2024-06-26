import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout/Layout';
import { WeatherProvider } from './provider/weatherProvider';

import '@/assets/styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeatherProvider>
      <Layout />
    </WeatherProvider>
  </React.StrictMode>
);
