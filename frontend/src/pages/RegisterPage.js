import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; // Make sure to create and import this CSS
import axios from 'axios';
import API_ENDPOINTS from '../constants/apiEndpoints';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'user'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill all fields correctly');
      return;
    }
    setLoading(true);

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };
    try{
      const res = await axios.post(API_ENDPOINTS.REGISTER_USER, userData);
      if (res.status !== 201) {
        throw new Error(res.message || 'Registration failed');
      }
      

      if (res.status === 201) {
        alert('Registration successful! Redirecting to dashboard...');
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/dashboard';
        return;
      }
    }catch(error){
      alert(error.response?.data?.message || 'Registration failed');
      setLoading(false);
      return;
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__card">
          <h2 className="register__title">Create your account</h2>
          <p className="register__subtitle">
            Join InfySpaces and start booking amazing workspaces
          </p>

          <form onSubmit={handleSubmit} className="register__form">
            <div className="register__grid">
              <div>
                <label className="register__label">First Name *</label>
                <input
                  type="text"
                  className="register__input"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="register__label">Last Name *</label>
                <input
                  type="text"
                  className="register__input"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="register__label">Email Address *</label>
              <input
                type="email"
                className="register__input"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="register__label">Phone Number</label>
              <input
                type="tel"
                className="register__input"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="register__label">Password *</label>
              <div className="register__password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="register__input"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="register__toggle"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="register__label">Confirm Password *</label>
              <div className="register__password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="register__input"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="register__toggle"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="register__error">Passwords do not match</p>
              )}
            </div>

            <div className="register__checkbox">
              <input
                id="terms"
                type="checkbox"
                required
              />
              <label htmlFor="terms">
                I agree to the{' '}
                <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="register__btn"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="register__divider">Or continue with</div>

          <div className="register__social-buttons">
            <button className="register__social-btn">Google</button>
            <button className="register__social-btn">Twitter</button>
          </div>

          <div className="register__footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
