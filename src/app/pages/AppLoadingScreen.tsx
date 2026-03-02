import React, { useEffect, useState } from 'react';

interface AppLoadingScreenProps {
  onComplete: () => void;
}

export function AppLoadingScreen({ onComplete }: AppLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(() => onComplete(), 700);
          return 100;
        }
        return p + 2;
      });
    }, 48);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #850222 0%, #3A000E 50%, #140005 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'imitrFadeInUp 0.8s ease-out both',
        }}
      >
        {/* App Icon */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #FEFFAE, #E0E090)',
            boxShadow: '0 4px 20px rgba(254,255,174,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            animation: 'imitrBreath 3s ease-in-out infinite',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              color: '#850222',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            IM
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            letterSpacing: '6px',
            color: '#FEFFAE',
            margin: 0,
            marginBottom: '8px',
          }}
        >
          IMITR
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            letterSpacing: '3px',
            color: 'rgba(254,255,174,0.6)',
            margin: 0,
            marginBottom: '40px',
          }}
        >
          Connect. Talk. Earn.
        </p>

        {/* Progress Bar */}
        <div style={{ width: '192px' }}>
          <div
            style={{
              height: '4px',
              borderRadius: '999px',
              background: 'rgba(254,255,174,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #FEFFAE, #E0E090)',
                width: `${progress}%`,
                transition: 'width 0.08s linear',
              }}
            />
          </div>

          {/* Loading text */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              letterSpacing: '1px',
              color: 'rgba(254,255,174,0.5)',
              textAlign: 'center',
              margin: '10px 0 0 0',
            }}
          >
            Loading your experience...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes imitrFadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imitrBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}
