import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

import ScrollToTop from './components/common/ScrollToTop.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer/index'

const store = configureStore({
  reducer: rootReducer
})

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
)
