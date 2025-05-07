import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

import ScrollToTop from './components/common/ScrollToTop.jsx'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer/index'

const store = configureStore({
  reducer: rootReducer
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
        <ScrollToTop>
          <App />
        </ScrollToTop>
        <Toaster />
    </BrowserRouter>
  </Provider>
)