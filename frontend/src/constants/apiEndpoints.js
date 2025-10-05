// src/constants/apiEndpoints.js

const BASE_URL = 'http://localhost:5000/'; // or your production URL

const API_ENDPOINTS = {
  // Auth
  LOGIN: `${BASE_URL}user/login`,
  REGISTER_USER: `${BASE_URL}user/register/EndUser`,
  LOGOUT: `${BASE_URL}/auth/logout`,

  // User
  GET_USER_PROFILE: `${BASE_URL}/users/profile`,
  UPDATE_USER_PROFILE: `${BASE_URL}/users/update`,

  // Spaces
  GET_ALL_SPACES: `${BASE_URL}/spaces`,
  GET_SPACE_BY_ID: id => `${BASE_URL}/spaces/${id}`,
  CREATE_SPACE: `${BASE_URL}/spaces/create`,
  DELETE_SPACE: id => `${BASE_URL}/spaces/${id}`,

  // Bookings
  CREATE_BOOKING: `${BASE_URL}/bookings/create`,
  GET_USER_BOOKINGS: `${BASE_URL}/bookings/user`,

  // Categories
  GET_CATEGORIES: `${BASE_URL}/categories`,
};

export default API_ENDPOINTS;
