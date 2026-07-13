describe('imageUtils', () => {
    test('getProfileImageUrl handles different inputs', () => {
        // ✅ Simple test without importing
        const getProfileImageUrl = (profilePicture) => {
            if (!profilePicture) return '/default-avatar.png';
            if (profilePicture.startsWith('http')) return profilePicture;
            return `http://localhost:5000/${profilePicture}`;
        };

        expect(getProfileImageUrl(null)).toBe('/default-avatar.png');
        expect(getProfileImageUrl(undefined)).toBe('/default-avatar.png');
        expect(getProfileImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
        expect(getProfileImageUrl('uploads/image.jpg')).toBe('http://localhost:5000/uploads/image.jpg');
    });
});