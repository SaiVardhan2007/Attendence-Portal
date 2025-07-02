import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { signOutUser } from '../utils/supabaseClient'

const Header = () => {
  const { 
    user, 
    setUser, 
    cartItemsCount, 
    toggleCart,
    clearCart 
  } = useAppContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const { error } = await signOutUser()
      if (!error) {
        setUser(null)
        clearCart()
        navigate('/login')
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🍕 FoodieExpress
          </Link>
          
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <span className="nav-link">Welcome, {user?.email?.split('@')[0] || 'User'}!</span>
            <button 
              className="nav-link" 
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
            <button className="cart-btn" onClick={toggleCart}>
              🛒 Cart
              {cartItemsCount > 0 && (
                <span className="cart-count">{cartItemsCount}</span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header