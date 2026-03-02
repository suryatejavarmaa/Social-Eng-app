import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SelectOption {
  value: string;
  label: string;
}

interface PremiumSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}

export function PremiumSelect({
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  icon,
}: PremiumSelectProps) {
  const { colors, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
    },
    [onChange],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          style={{
            color: colors.textSecondary,
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            marginBottom: '6px',
            display: 'block',
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3"
        style={{
          background: colors.cardBg,
          border: `1px solid ${isOpen ? colors.primary : colors.cardBorder}`,
          outline: 'none',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      >
        {icon && (
          <span style={{ color: selectedOption ? colors.primary : colors.inactive, flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <span
          className="flex-1 text-left"
          style={{
            color: selectedOption ? colors.text : colors.inactive,
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          style={{
            color: colors.textSecondary,
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl"
          style={{
            background:
              theme === 'night'
                ? 'rgba(2, 30, 22, 0.95)'
                : 'rgba(80, 2, 20, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${colors.primary}30`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${colors.primary}15, inset 0 1px 0 ${colors.primary}10`,
          }}
        >
          {/* Subtle gradient top highlight */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
            }}
          />

          <div className="py-1.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="flex w-full items-center gap-3 px-4 py-3"
                  style={{
                    background: isSelected
                      ? `${colors.primary}20`
                      : 'transparent',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = `${colors.primary}12`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }
                  }}
                >
                  {/* Selection indicator */}
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: isSelected ? colors.buttonGradient : `${colors.primary}10`,
                      border: isSelected ? 'none' : `1px solid ${colors.primary}25`,
                    }}
                  >
                    {isSelected && <Check size={11} style={{ color: colors.buttonText }} />}
                  </span>

                  <span
                    style={{
                      color: isSelected ? colors.primary : colors.text,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                    }}
                  >
                    {option.label}
                  </span>

                  {isSelected && (
                    <span className="ml-auto">
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{
                          background: `${colors.primary}15`,
                          color: colors.primary,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '10px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Selected
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
