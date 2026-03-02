import React, { useState } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppLoadingScreen } from './pages/AppLoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* RouterProvider always mounted so it's ready when splash fades out */}
      <RouterProvider router={router} />

      {/* Splash overlays on top until complete */}
      {loading && <AppLoadingScreen onComplete={() => setLoading(false)} />}
    </>
  );
}
