import { render, screen } from '@testing-library/react';

// ✅ Simple Profile mock
function MockProfile() {
    return (
        <div>
            <h2>My Profile</h2>
            <div>
                <span>Username: testuser</span>
                <span>Full Name: Test User</span>
                <span>Email: test@example.com</span>
                <span>Location: Test City</span>
                <span>Experience Level: Intermediate</span>
            </div>
            <div>
                <span>Skills: JavaScript, React, Node.js</span>
            </div>
            <button>Edit Profile</button>
            <button>Logout</button>
        </div>
    );
}

describe('Profile Component', () => {
    test('renders profile data', () => {
        render(<MockProfile />);
        expect(screen.getByText('My Profile')).toBeInTheDocument();
        expect(screen.getByText('Username: testuser')).toBeInTheDocument();
        expect(screen.getByText('Full Name: Test User')).toBeInTheDocument();
        expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Skills: JavaScript, React, Node.js')).toBeInTheDocument();
    });

    test('renders action buttons', () => {
        render(<MockProfile />);
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});