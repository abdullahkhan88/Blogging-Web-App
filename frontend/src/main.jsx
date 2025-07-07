import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
    
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={2500} />
    </Provider>
  
)
