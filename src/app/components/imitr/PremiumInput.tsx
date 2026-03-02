import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PremiumInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  className?: string;
  label?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function PremiumInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  rightIcon,
  onRightIconClick,
  className = '',
  label,
  maxLength,
  disabled,
}: PremiumInputProps) {
  const { colors } = useTheme();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className="mb-2 block"
          style={{
            color: colors.textSecondary,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 min-w-0"
        style={{
          background: colors.inputBg,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${colors.border}`,
        }}
      >
        {icon && (
          <span
            style={{
              color: colors.textSecondary,
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent outline-none"
          style={{
            color: colors.text,
            fontFamily: "'Inter', sans-serif",
          }}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="flex items-center justify-center"
            style={{
              color: colors.textSecondary,
            }}
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}