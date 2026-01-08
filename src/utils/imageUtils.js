// Utility function to get full image URL from relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5007';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';

    // If it's a blob URL (local file preview), return as is
    if (imagePath.startsWith('blob:')) {
        return imagePath;
    }

    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Otherwise, prepend the backend URL for relative paths
    return `${API_BASE_URL}${imagePath}`;
};

export default getImageUrl;
