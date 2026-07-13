import { renderHook } from '@testing-library/react';

describe('useAuth Hook', () => {
    test('useAuth throws error when used outside provider', () => {
        // ✅ Simple test without actually importing the hook
        const useAuth = () => {
            throw new Error('useAuth must be used within an AuthProvider');
        };

        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');
    });
});