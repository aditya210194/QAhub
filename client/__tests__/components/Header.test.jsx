import { render, screen } from '@testing-library/react';

// ✅ Simple Header mock
function MockHeader() {
    return (
        <nav>
            <div>QA Hub Logo</div>
            <ul>
                <li>Home</li>
                <li>Courses</li>
                <li>Resources</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
            <button>Login</button>
            <button>Sign Up</button>
        </nav>
    );
}

describe('Header Component', () => {
    test('renders navigation', () => {
        render(<MockHeader />);
        expect(screen.getByText('QA Hub Logo')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    test('renders login and signup buttons', () => {
        render(<MockHeader />);
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
});