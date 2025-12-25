import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';
import API_ENDPOINTS from '../constants/apiEndpoints';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try{
      const res = await axios.post(API_ENDPOINTS.LOGIN, formData);
      if (res.status !== 200) {
        throw new Error(res.message || 'Login failed');
        setLoading(false);
      }
      if( res.status === 200){
        alert('Login successful! Redirecting to dashboard...');
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('id', res.data.user.id);
        sessionStorage.setItem('name', res.data.user.name);
        sessionStorage.setItem('email', res.data.user.email);
        if(res.data.user.role){
          sessionStorage.setItem('isLogin', true);
        }
        if(res.data.user.role === 'admin'){
          window.location.href =  '/admin';
        }else if(res.data.user.role === 'client'){
          window.location.href =  '/';
        }else{
          window.location.href =  '/hostDashboard';
        }
      }
    }catch(error){
      alert(error.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  useEffect(()=>{
    sessionStorage.clear();
  },[]);

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Welcome Back</h2>
        <p className="login__subtitle">Sign in to your account to continue</p>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label className="login__label">
              Email Address
            </label>
            <input
              type="email"
              className="login__input"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login__field">
            <label className="login__label">
              Password
            </label>
            <div className="login__password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login__input"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="login__toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="login__options">
            <label className="login__checkbox">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgot-password" className="login__link">Forgot Password?</Link>
          </div>

          <button type="submit" className="login__button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login__footer">
          Don't have an account? <Link to="/register" className="login__link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
