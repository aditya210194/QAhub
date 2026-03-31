export const getProfileImageUrl = (profilePicture) => {
    if (!profilePicture) return '/default-avatar.png';

    // Full URL
    if (profilePicture.startsWith('http')) {
        return profilePicture;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    let imagePath = profilePicture.replace(/\\/g, '/');

    if (imagePath.includes('uploads/')) {
        return `${baseUrl}/${imagePath}`;
    }

    return `${baseUrl}/uploads/profile_pictures/${imagePath.split('/').pop()}`;
};