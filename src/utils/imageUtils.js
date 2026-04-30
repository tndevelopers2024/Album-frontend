import { ASSET_URL } from '../api';

// Utility function to get full image URL from relative path
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
    return `${ASSET_URL}${imagePath}`;
};

export default getImageUrl;

