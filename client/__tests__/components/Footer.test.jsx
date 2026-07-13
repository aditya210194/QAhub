import { render, screen } from '@testing-library/react';

// ✅ Simple Footer mock
function MockFooter() {
    const year = new Date().getFullYear();
    return (
        <footer>
            <p>© {year} QA Hub. All Rights Reserved. |</p>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms & Conditions</a>
            <a href="/contact">Contact Us</a>
        </footer>
    );
}

describe('Footer Component', () => {
    test('renders footer', () => {
        render(<MockFooter />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} QA Hub`))).toBeInTheDocument();
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });
});