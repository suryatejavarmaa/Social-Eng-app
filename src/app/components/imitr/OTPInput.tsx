import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const { colors } = useTheme();
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Web OTP API support for auto-fill
  useEffect(() => {
    if ('OTPCredential' in window) {
      const abortController = new AbortController();

      navigator.credentials.get({
        // @ts-ignore - WebOTP API types not fully supported yet
        otp: { transport: ['sms'] },
        signal: abortController.signal,
      })
        .then((otp: any) => {
          if (otp && otp.code) {
            const otpCode = otp.code;
            const digits = otpCode.split('').slice(0, length);
            setValues(digits);
            if (onComplete && digits.length === length) {
              onComplete(digits.join(''));
            }
          }
        })
        .catch((err: any) => {
          console.log('OTP auto-fill error:', err);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [length, onComplete]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...values];
    next[index] = val.slice(-1);
    setValues(next);
    if (val && index < length - 1) refs.current[index + 1]?.focus();
    const otp = next.join('');
    if (otp.length === length && onComplete) onComplete(otp);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const digits = pastedData.split('').slice(0, length);
    const next = [...values];
    digits.forEach((digit, i) => {
      next[i] = digit;
    });
    setValues(next);
    if (digits.length === length && onComplete) {
      onComplete(digits.join(''));
    }
    const focusIndex = Math.min(digits.length, length - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex w-full justify-between gap-2">
      {values.map((v, i) => {
        const isFocused = focusedIndex === i;
        const isFilled = !!v;
        return (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(-1)}
            onPaste={handlePaste}
            className="flex-1 rounded-xl text-center outline-none"
            style={{
              height: '52px',
              maxWidth: '52px',
              minWidth: '0',
              background: isFilled
                ? `${colors.primary}12`
                : colors.inputBg,
              backdropFilter: 'blur(16px)',
              border: `1.5px solid ${
                isFilled
                  ? colors.primary
                  : colors.border
              }`,
              color: colors.text,
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px',
              letterSpacing: '0.05em',
              caretColor: colors.primary,
            }}
          />
        );
      })}
    </div>
  );
}