import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';
import '../src/App.css';

import Providers from './providers';
import ClientLayout from './client-layout';
import ErrorBoundary from '../src/components/ErrorBoundary';

export const metadata = {
    title: 'QA Hub - Software Testing Education',
    description: 'Learn software testing with QA Hub.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <ErrorBoundary>
            <Providers>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </Providers>
        </ErrorBoundary>
        </body>
        </html>
    );
}