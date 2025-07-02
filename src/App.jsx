import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import Header from './components/Header.jsx'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RestaurantDetails from './pages/RestaurantDetails'
import CheckoutPage from './pages/CheckoutPage'
import CartSidebar from './components/CartSidebar'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext()
  return user ? children : <Navigate to="/login" />
}

// App Content component (needs to be inside AppProvider)
const AppContent = () => {
  const { user } = useAppContext()

  return (
    <Router>
      <div className="App">
        {user && <Header />}
        <CartSidebar />
        
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <LoginPage />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurant/:id" 
            element={
              <ProtectedRoute>
                <RestaurantDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App