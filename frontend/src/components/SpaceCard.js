import React from 'react';
import { Link } from 'react-router-dom';
import './SpaceCard.css';

const SpaceCard = ({ space }) => {
  const {
    id,
    name,
    location,
    price,
    rating,
    image,
    amenities = [],
    capacity,
    type
  } = space;

  // Replace icons with emojis or inline SVG where possible
  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <span className="space-card__amenity-icon" role="img" aria-label="WiFi">📶</span>;
      case 'coffee':
        return <span className="space-card__amenity-icon" role="img" aria-label="Coffee">☕</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-card" tabIndex={0} aria-label={`Space: ${name}, located at ${location}, price ₹${price} per hour`}>
      {/* Image */}
      <div className="space-card__image-container">
        <img
          src={image || 'https://via.placeholder.com/400x250?text=Space+Image'}
          alt={name}
          className="space-card__image"
        />
        <div className="space-card__badge">{type}</div>
        <div className="space-card__rating" aria-label={`Rating: ${rating} stars`}>
          <span className="space-card__star" role="img" aria-hidden="true">⭐</span>
          <span>{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-card__content">
        <h3 className="space-card__title">{name}</h3>

        <div className="space-card__location">
          <span className="space-card__location-icon" role="img" aria-label="Location">📍</span>
          <span>{location}</span>
        </div>

        <div className="space-card__price">
          ₹{price}
          <span className="space-card__price-unit">/hour</span>
        </div>

        {amenities.length > 0 && (
          <div className="space-card__amenities">
            {amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="space-card__amenity">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-card__capacity">
          <span className="space-card__capacity-icon" role="img" aria-label="Capacity">👥</span>
          <span>Up to {capacity} people</span>
        </div>

        <div className="space-card__actions">
          <Link to={`/space/${id}`} className="space-card__view-button">
            View Details
          </Link>
          <Link to={`/booking/${id}`} className="space-card__book-button">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
