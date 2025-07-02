import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { signInUser, signUpUser } from '../utils/supabaseClient'

const LoginPage = () => {
  const { setUser, setLoading, loading } = useAppContext()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        // Validation for sign up
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long')
          setLoading(false)
          return
        }

        if (!formData.fullName.trim()) {
          setError('Full name is required')
          setLoading(false)
          return
        }

        const { data, error } = await signUpUser(
          formData.email, 
          formData.password, 
          formData.fullName
        )

        if (error) {
          setError(error.message)
        } else {
          // For sign up, user needs to verify email first
          setError('Please check your email to verify your account before signing in.')
          setIsSignUp(false)
        }
      } else {
        // Sign in
        const { data, error } = await signInUser(formData.email, formData.password)
        
        if (error) {
          setError(error.message)
        } else {
          setUser(data.user)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Auth error:', err)
    }

    setLoading(false)
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? 'Sign Up for FoodieExpress' : 'Welcome to FoodieExpress'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        {isSignUp && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
            minLength={isSignUp ? 6 : undefined}
          />
        </div>

        {isSignUp && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
            />
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>

        <div className="auth-switch">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button type="button" onClick={toggleAuthMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage