import React, { useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function PremiumButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled = false,
  size = 'md',
  loading = false,
}: PremiumButtonProps) {
  const { colors } = useTheme();

  const handleClick = useCallback(() => {
    if (disabled || loading) return;
    onClick?.();
  }, [disabled, loading, onClick]);

  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3.5',
    lg: 'px-8 py-4',
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: '16px',
    fontFamily: "'Inter', sans-serif",
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    overflow: 'hidden',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      ...baseStyle,
      background: colors.buttonGradient,
      color: colors.buttonText,
      boxShadow: `0 4px 24px ${colors.glowColor}`,
    },
    outline: {
      ...baseStyle,
      background: 'transparent',
      color: colors.primary,
      border: `1.5px solid ${colors.border}`,
    },
    ghost: {
      ...baseStyle,
      background: 'transparent',
      color: colors.text,
    },
    danger: {
      ...baseStyle,
      background: `${colors.danger}15`,
      color: colors.danger,
      border: `1px solid ${colors.danger}40`,
    },
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`imitr-ripple ${fullWidth ? 'w-full' : ''} ${sizeClasses[size]} ${className}`}
      style={variantStyles[variant]}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current"
            style={{ borderTopColor: 'transparent' }}
          />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}