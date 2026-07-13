import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// ✅ Polyfill TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// ✅ Mock next/link
jest.mock('next/link', () => {
    return ({ children, href, onClick, className }) => {
        return (
            <a href={href} onClick={onClick} className={className}>
                {children}
            </a>
        );
    };
});

// ✅ Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

// ✅ Mock sessionStorage and localStorage
const mockStorage = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
        get length() { return Object.keys(store).length; },
        key: jest.fn((index) => Object.keys(store)[index] || null),
    };
})();

Object.defineProperty(window, 'sessionStorage', { value: { ...mockStorage } });
Object.defineProperty(window, 'localStorage', { value: { ...mockStorage } });

// ✅ Mock window methods
window.scrollTo = jest.fn();
window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

// ✅ Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    disconnect() {}
    observe() {}
    unobserve() {}
};

// ✅ Mock fetch
global.fetch = jest.fn();

// ✅ Suppress console errors during tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
};

// ✅ Fix for react-testing-library
jest.mock('@testing-library/react', () => ({
    ...jest.requireActual('@testing-library/react'),
    render: jest.fn((ui, options) => {
        const { render: actualRender } = jest.requireActual('@testing-library/react');
        return actualRender(ui, { ...options, wrapper: ({ children }) => children });
    }),
}));