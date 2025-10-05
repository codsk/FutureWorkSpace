import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    date: '',
    guests: '1',
  });

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchData);
    navigate(`/listings?${queryParams.toString()}`);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-bar__form">
        {/* Location */}
        <div className="search-bar__group">
          <label className="search-bar__label">Location</label>
          <input
            type="text"
            placeholder="Where are you looking?"
            value={searchData.location}
            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
            className="search-bar__input"
          />
        </div>

        {/* Date */}
        <div className="search-bar__group">
          <label className="search-bar__label">Date</label>
          <input
            type="date"
            value={searchData.date}
            onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
            className="search-bar__input"
          />
        </div>

        {/* Guests */}
        <div className="search-bar__group">
          <label className="search-bar__label">Guests</label>
          <select
            value={searchData.guests}
            onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
            className="search-bar__select"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5+">5+ Guests</option>
          </select>
        </div>

        {/* Search Button */}
        <button type="submit" className="search-bar__button">
          🔍 Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
