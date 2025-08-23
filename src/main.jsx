import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import './utility/i18n.js'

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <App />
    </Provider>
)
