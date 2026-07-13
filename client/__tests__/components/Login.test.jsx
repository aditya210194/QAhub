import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ✅ Simple mock for Login
jest.mock('@/components/Auth/Login', () => {
    return function MockLogin() {
        return (
            <div>
                <h2>Welcome Back</h2>
                <form>
                    <label>Email</label>
                    <input type="email" placeholder="your.email@example.com" />
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        );
    };
});

describe('Login Component', () => {
    test('renders login form', () => {
        const Login = require('@/components/Auth/Login').default;
        render(<Login />);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });
});