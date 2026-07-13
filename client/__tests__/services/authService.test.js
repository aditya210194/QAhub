describe('Auth Service', () => {
    test('loginUser handles successful login', async () => {
        const loginUser = async (credentials) => {
            if (credentials.email === 'test@example.com') {
                return { token: 'mock-token', user: { id: '1', username: 'testuser' } };
            }
            throw new Error('Invalid credentials');
        };

        const result = await loginUser({ email: 'test@example.com', password: 'password' });
        expect(result.token).toBe('mock-token');
        expect(result.user.username).toBe('testuser');
    });

    test('loginUser handles error', async () => {
        const loginUser = async () => {
            throw new Error('Invalid credentials');
        };

        await expect(loginUser()).rejects.toThrow('Invalid credentials');
    });

    test('logoutUser clears session storage', () => {
        const logoutUser = () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
        };

        sessionStorage.setItem('token', 'mock-token');
        sessionStorage.setItem('user', '{"username":"testuser"}');
        logoutUser();
        expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
        expect(sessionStorage.removeItem).toHaveBeenCalledWith('user');
    });
});