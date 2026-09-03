// src/config/api.js

const API_URL = process.env.REACT_APP_API_URL || 'https://api.honarmand.shop/';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://honarmand.shop/';

export const API_CONFIG = {
  baseURL: API_URL,
  baseURLFront: BASE_URL,
  endpoints: {
    products: `${API_URL}api/products`,
    categories: `${API_URL}api/categories`,
    product: (id) => `${API_URL}api/products/${id}`,
    cart: `${API_URL}api/cart`,
    orders: `${API_URL}api/orders`,
    users: `${API_URL}api/users`,
    auth: `${API_URL}api/auth`,
    reviews: `${API_URL}api/reviews`,
    wishlist: `${API_URL}api/wishlist`,
    search: `${API_URL}api/search`,
    blog: `${API_URL}api/blog`,
    contact: `${API_URL}api/contact`,
    pages: `${API_URL}api/pages`,
    menu: `${API_URL}api/menu`,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export default API_CONFIG;