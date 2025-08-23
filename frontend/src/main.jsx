import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';

// Set base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster position='top-right' expand={true} />
    <App />
  </React.StrictMode>
);
