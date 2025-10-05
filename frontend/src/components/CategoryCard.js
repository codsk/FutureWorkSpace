import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const { name, description, color, count } = category;

  return (
    <Link to={`/listings?category=${name.toLowerCase()}`} className="category-card">
      <div className="category-card__content">
        <div className="category-card__left">
          <div
            className="category-card__icon-container"
            style={{ backgroundColor: color }}
          >
            {name.charAt(0)} {/* Placeholder instead of icon */}
          </div>
          <div className="category-card__info">
            <h3 className="category-card__title">{name}</h3>
            <p className="category-card__description">{description}</p>
            <p className="category-card__count">{count} spaces available</p>
          </div>
        </div>
        <span className="category-card__arrow">→</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
