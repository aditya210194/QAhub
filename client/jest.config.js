const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@context/(.*)$': '<rootDir>/src/context/$1',
        '^@views/(.*)$': '<rootDir>/src/views/$1',
        '^@admin/(.*)$': '<rootDir>/src/admin/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/**/*.spec.{js,jsx}',
        '!src/index.js',
        '!src/reportWebVitals.js',
        '!src/setupTests.js',
    ],
    // ✅ Fix: Transform ESM modules
    transformIgnorePatterns: [
        'node_modules/(?!(next|@next|react-router-dom|react-router|@vantezzen)/)',
    ],
    // ✅ Fix: Add transform for ESM
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    // ✅ Fix: Use a different test environment for React
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
};

module.exports = createJestConfig(customJestConfig);