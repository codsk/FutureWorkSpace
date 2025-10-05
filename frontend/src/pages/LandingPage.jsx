import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.scss';

const LandingPage = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [propertyData, setPropertyData] = useState([]);
  const [carouselIndices, setCarouselIndices] = useState({});

  const handleCityClick = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
    setShowModal(false);
    getPropertyDetailsByCity(city);
  };

  const cities = [
    { name: 'Hyderabad', icon: '🕌', id: 1 },
    { name: 'Bangalore', icon: '🌆', id: 2 },
    { name: 'Mumbai', icon: '🏙️', id: 3 },
    { name: 'Delhi', icon: '🕌', id: 4 },
    { name: 'Chennai', icon: '🏛️', id: 5 },
  ];

  const handleCarouselChange = (placeId, direction) => {
    setCarouselIndices((prevIndices) => {
      const currentIndex = prevIndices[placeId] || 0;
      const property = propertyData.find((place) => place._id === placeId);
      const newIndex = (currentIndex + direction + (property?.image?.length || 0)) % (property?.image?.length || 1);
      return { ...prevIndices, [placeId]: newIndex };
    });
  };

  function getPropertyDetailsByCity(city) {
    fetch(`http://localhost:5000/api/property/get/propertyDetailsByCity/${city}`)
      .then((res) => res.json())
      .then((data) => {
        setPropertyData(data.properties);
        const initialCarouselIndices = data.properties.reduce((acc, place) => {
          acc[place._id] = 0; // Start each property with the first image in carousel
          return acc;
        }, {});
        setCarouselIndices(initialCarouselIndices);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
  const storedCity = localStorage.getItem('selectedCity');
  if (storedCity) {
    setSelectedCity(storedCity);
    setShowModal(false);
    getPropertyDetailsByCity(storedCity);
  }
}, []); // Only run once on mount


  useEffect(() => {
    const interval = setInterval(() => {
      if (propertyData && propertyData.length > 0) {
        setCarouselIndices((prevIndices) => {
          return propertyData.reduce((acc, place) => {
            if (place.image.length > 0) {
              acc[place._id] = (prevIndices[place._id] + 1) % place.image.length;
            }
            return acc;
          }, {});
        });
      }
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [propertyData]);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-page__header">
        <div className="landing-page__header__left">
          <div className="landing-page__header__left--logo">InfySpaces</div>
          {selectedCity && (
            <div className="landing-page__header__left--selected-city">
              <p onClick={() => setShowModal(true)}>{selectedCity}</p>
            </div>
          )}
        </div>
        <div className="landing-page__header__right">
          <div className="landing-page__header__right--links">
            <Link to="/" className="landing-page__header__right--links--link">Browse Spaces</Link>
            <Link to="/register" className="landing-page__header__right--links--link">Become a Host</Link>
            <Link to="/about" className="landing-page__header__right--links--link">About</Link>
            <Link to="/login" className="landing-page__header__right--links--link">LogIn</Link>
            <Link to="/register" className="landing-page__header__right--links--link">SignUp</Link>
          </div>
        </div>
      </header>

      {/* Modal Popup */}
      {showModal && (
        <div className="landing-page__modal-overlay">
          <div className="landing-page__modal-overlay__content">
            <button className="landing-page__modal-overlay__content--close" onClick={() => setShowModal(true)}>X</button>
            <h2>Choose Your City</h2>
            <div className="landing-page__modal-overlay__content__cities">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="landing-page__modal-overlay__content__cities--city"
                  onClick={() => handleCityClick(city.name)}
                >
                  <div className="landing-page__modal-overlay__content__cities--icon">{city.icon}</div>
                  <div className="landing-page__modal-overlay__content__cities--name">{city.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="landing-page__hero">
        <div className="landing-page__hero-content">
          <h1>Find Your Perfect Workspace</h1>
          <p>Discover and book coworking spaces, creative studios, and event venues</p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="landing-page__card-section">
        <div className="landing-page__card-section__container">
          <div className="landing-page__card-section__container--header">
            <h2>Featured Spaces</h2>
            <Link to="/listings" className="landing-page__card-section__container--header--view-all">View All →</Link>
          </div>
          <div className="landing-page__card-section__container__cards">
            {propertyData.map((property) => (
              <div key={property._id} className="landing-page__card-section__container__cards--card">
                {property?.image ? (
                  <>
                    <img
                      src={`http://localhost:5000/${property.image[carouselIndices[property._id]]?.path}`}
                      alt=""
                      className="landing-page__card-section__container__cards--card--image"
                    />
                    <div className="landing-page__card-section__container__cards--card__carousel-controls">
                      <button
                        className="landing-page__card-section__container__cards--card__carousel-controls--carousel-button prev"
                        onClick={() => handleCarouselChange(property._id, -1)} // Decrease index (previous)
                      >
                        &#8592;
                      </button>
                      <button
                        className="landing-page__card-section__container__cards--card__carousel-controls--carousel-button next"
                        onClick={() => handleCarouselChange(property._id, 1)} // Increase index (next)
                      >
                        &#8594;
                      </button>
                    </div>
                  </>
                ) : (
                  <img
                    src="https://via.placeholder.com/400x250?text=No+Image"
                    alt="No Image Available"
                    className="landing-page__card-section__container__cards--card--image"
                  />
                )}
                <div className="landing-page__card-section__container__cards--card--info">
                  <h5 className="landing-page__card-section__container__cards--card--info--name">{property.name}</h5>
                  <p className="landing-page__card-section__container__cards--card--info--para">{property.address.street}, {property.address.city}</p>
                  <p className="landing-page__card-section__container__cards--card--info--para">Rating: {property.rating}</p>
                  <button className="landing-page__card-section__container__cards--card--info--button">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-page__footer">
        <div className="landing-page__footer__container">
          <div className="landing-page__footer--section">
            <div className="landing-page__footer__container--section-logo">InfySpaces</div>
            <p>Find and book the perfect workspace for your needs.</p>
          </div>
          <div className="landing-page__footer__container--section">
            <h3>For Guests</h3>
            <Link to="/listings" className="landing-page__footer__container--section-link">Browse Spaces</Link>
            <Link to="/how-it-works" className="landing-page__footer__container--section-link">How it Works</Link>
            <Link to="/support" className="landing-page__footer__container--section-link">Support</Link>
          </div>
          <div className="landing-page__footer__container--section">
            <h3>For Hosts</h3>
            <Link to="/host" className="landing-page__footer__container--section-link">List Your Space</Link>
            <Link to="/hosting-guide" className="landing-page__footer__container--section-link">Hosting Guide</Link>
            <Link to="/host-support" className="landing-page__footer__container--section-link">Host Support</Link>
          </div>
          <div className="landing-page__footer__container--section">
            <h3>Company</h3>
            <Link to="/host" className="landing-page__footer__container--section-link">About Us</Link>
            <Link to="/hosting-guide" className="landing-page__footer__container--section-link">Careers</Link>
            <Link to="/host-support" className="landing-page__footer__container--section-link">Contact</Link>
          </div>
        </div>
        <div className="landing-page__footer__bottom">
          <p>© 2025 InfySpaces. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
