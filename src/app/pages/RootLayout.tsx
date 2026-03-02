import { Outlet, useRouteError } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from '../context/ThemeContext';
import { AppProvider } from '../context/AppContext';

export function RouteErrorFallback() {
  const error = useRouteError() as Error;
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#022B22',
      color: '#F9E4B7',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '12px' }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '20px' }}>
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
            color: '#022B22',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Outlet />
        <Toaster position="top-center" />
      </AppProvider>
    </ThemeProvider>
  );
}