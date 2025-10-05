import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLogin') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    // Whenever the session storage value changes, update the state.
    const handleStorageChange = () => {
      setIsLoggedIn(sessionStorage.getItem('isLogin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  function logout() {
    sessionStorage.clear();
    sessionStorage.setItem('isLogin', 'false');
    setIsLoggedIn(false); // Update the state
    navigate('/'); // Navigate to home page
  }

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">
            <span>I</span>
          </div>
          <span>InfySpaces</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <Link to="/listings" className="header__nav-link">
            Browse Spaces
          </Link>
          <Link to="/host" className="header__nav-link">
            Become a Host
          </Link>
          <Link to="/about" className="header__nav-link">
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="header__actions">
          {isLoggedIn ? (
            <button onClick={logout} className="header__logout-button">
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" className="header__login-button">
                Login
              </Link>
              <Link to="/register" className="header__signup-button">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`header__menu-button ${isMenuOpen ? "header__menu-button--active" : ""}`}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`header__mobile-menu ${isMenuOpen ? "header__mobile-menu--open" : ""}`}>
        <div className="header__mobile-nav">
          <Link to="/listings" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>
            Browse Spaces
          </Link>
          <Link to="/host" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>
            Become a Host
          </Link>
          <Link to="/about" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
        </div>

        {isLoggedIn ? (
          <div className="header__mobile-actions">
          <button onClick={logout}>Log out</button>
          </div>
        ) : (
          <div className="header__mobile-actions">
            <Link to="/login" className="header__mobile-login" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="header__mobile-signup" onClick={() => setIsMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
