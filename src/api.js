// API Configuration
const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5007';
const API_BASE_URL = `${SERVER_URL}/api`;

// Helper function to build full URL
const buildUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: buildUrl('/login'),
    REGISTER: buildUrl('/register'),
    VERIFY: buildUrl('/verify'),

    // Users
    USERS: buildUrl('/users'),
    USER_BY_ID: (id) => buildUrl(`/users/${id}`),
    PROFILE: (id) => buildUrl(`/profile/${id}`),
    UPDATE_PROFILE: (id) => buildUrl(`/profile/${id}`),
    FAVORITES: (userId) => buildUrl(`/favorites/${userId}`),
    TOGGLE_FAVORITE: buildUrl('/favorites/toggle'),

    // Products
    PRODUCTS: buildUrl('/products'),
    PRODUCT_BY_ID: (id) => buildUrl(`/products/${id}`),

    // Orders
    ORDERS: buildUrl('/orders'),
    ORDER_BY_ID: (id) => buildUrl(`/orders/${id}`),
    MY_ORDERS: (userId) => buildUrl(`/orders/my-orders/${userId}`),

    // Upload
    UPLOAD: buildUrl('/upload'),

    // Album Pricing
    ALBUM_PRICING: buildUrl('/album/pricing'),
};

// Export base URLs
export const API_BASE = API_BASE_URL;
export const ASSET_URL = SERVER_URL;

export default API_ENDPOINTS;

