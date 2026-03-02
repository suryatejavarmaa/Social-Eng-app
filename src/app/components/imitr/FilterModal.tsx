import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from './GlassCard';

export interface FilterOptions {
  status: 'all' | 'online' | 'offline';
  gender: 'all' | 'male' | 'female';
  favourites: boolean;
  verified: boolean;
  ageRange: [number, number];
  minRating: number;
  maxDistance: number | null; // null means no distance filter
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

export function FilterModal({ isOpen, onClose, filters, onApply }: FilterModalProps) {
  const { colors } = useTheme();
  const [tempFilters, setTempFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      status: 'all',
      gender: 'all',
      favourites: false,
      verified: false,
      ageRange: [18, 50],
      minRating: 0,
      maxDistance: null,
    };
    setTempFilters(resetFilters);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 z-50 max-h-[80vh] overflow-y-auto"
            style={{
              background: colors.cardBg,
              backdropFilter: 'blur(40px)',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '24px',
              boxShadow: `0 20px 60px ${colors.glowColor}`,
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
                  Filters
                </h3>
                <button
                  onClick={onClose}
                  className="imitr-ripple flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: colors.cardBg }}
                >
                  <X size={20} style={{ color: colors.textSecondary }} />
                </button>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <p className="mb-3" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}>
                  Status
                </p>
                <div className="flex gap-2">
                  {(['all', 'online', 'offline'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setTempFilters({ ...tempFilters, status })}
                      className="imitr-ripple flex-1 rounded-xl px-4 py-2.5"
                      style={{
                        background: tempFilters.status === status ? colors.buttonGradient : colors.cardBg,
                        color: tempFilters.status === status ? colors.buttonText : colors.text,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        border: `1px solid ${tempFilters.status === status ? 'transparent' : colors.cardBorder}`,
                        transition: 'all 0.3s ease',
                        boxShadow: tempFilters.status === status ? `0 2px 12px ${colors.glowColor}` : 'none',
                      }}
                    >
                      {status === 'all' ? 'All' : status === 'online' ? 'Online' : 'Offline'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <p className="mb-3" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}>
                  Gender
                </p>
                <div className="flex gap-2">
                  {(['all', 'male', 'female'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setTempFilters({ ...tempFilters, gender })}
                      className="imitr-ripple flex-1 rounded-xl px-4 py-2.5"
                      style={{
                        background: tempFilters.gender === gender ? colors.buttonGradient : colors.cardBg,
                        color: tempFilters.gender === gender ? colors.buttonText : colors.text,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        border: `1px solid ${tempFilters.gender === gender ? 'transparent' : colors.cardBorder}`,
                        transition: 'all 0.3s ease',
                        boxShadow: tempFilters.gender === gender ? `0 2px 12px ${colors.glowColor}` : 'none',
                      }}
                    >
                      {gender === 'all' ? 'All' : gender === 'male' ? 'Male' : 'Female'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}>
                    Age Range
                  </p>
                  <p style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                    {tempFilters.ageRange[0]} - {tempFilters.ageRange[1]}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={tempFilters.ageRange[0]}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          ageRange: [Number(e.target.value), tempFilters.ageRange[1]],
                        })
                      }
                      className="w-full"
                      style={{
                        accentColor: colors.primary,
                      }}
                    />
                    <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', marginTop: '4px' }}>
                      Min: {tempFilters.ageRange[0]}
                    </p>
                  </div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={tempFilters.ageRange[1]}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          ageRange: [tempFilters.ageRange[0], Number(e.target.value)],
                        })
                      }
                      className="w-full"
                      style={{
                        accentColor: colors.primary,
                      }}
                    />
                    <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px', marginTop: '4px' }}>
                      Max: {tempFilters.ageRange[1]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}>
                    Minimum Rating
                  </p>
                  <div className="flex items-center gap-1">
                    <Star size={14} style={{ color: colors.primary, fill: colors.primary }} />
                    <p style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                      {tempFilters.minRating === 0 ? 'Any' : tempFilters.minRating.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0, 4.0, 4.5, 4.7, 4.9].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setTempFilters({ ...tempFilters, minRating: rating })}
                      className="imitr-ripple flex-1 rounded-xl px-3 py-2"
                      style={{
                        background: tempFilters.minRating === rating ? colors.buttonGradient : colors.cardBg,
                        color: tempFilters.minRating === rating ? colors.buttonText : colors.text,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '12px',
                        border: `1px solid ${tempFilters.minRating === rating ? 'transparent' : colors.cardBorder}`,
                        transition: 'all 0.3s ease',
                        boxShadow: tempFilters.minRating === rating ? `0 2px 12px ${colors.glowColor}` : 'none',
                      }}
                    >
                      {rating === 0 ? 'Any' : rating.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 600 }}>
                    Distance
                  </p>
                  <p style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                    {tempFilters.maxDistance === null ? 'Anywhere' : tempFilters.maxDistance < 1 ? `${tempFilters.maxDistance * 1000}m` : `${tempFilters.maxDistance}km`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Anywhere', value: null },
                    { label: '300m', value: 0.3 },
                    { label: '500m', value: 0.5 },
                    { label: '1km', value: 1 },
                    { label: '5km', value: 5 },
                    { label: '10km', value: 10 },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setTempFilters({ ...tempFilters, maxDistance: option.value })}
                      className="imitr-ripple rounded-xl px-3 py-2.5"
                      style={{
                        background: tempFilters.maxDistance === option.value ? colors.buttonGradient : colors.cardBg,
                        color: tempFilters.maxDistance === option.value ? colors.buttonText : colors.text,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '12px',
                        border: `1px solid ${tempFilters.maxDistance === option.value ? 'transparent' : colors.cardBorder}`,
                        transition: 'all 0.3s ease',
                        boxShadow: tempFilters.maxDistance === option.value ? `0 2px 12px ${colors.glowColor}` : 'none',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="mb-6 space-y-3">
                <button
                  onClick={() => setTempFilters({ ...tempFilters, favourites: !tempFilters.favourites })}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    ❤ Favourites Only
                  </span>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{
                      background: tempFilters.favourites ? colors.buttonGradient : 'transparent',
                      border: `2px solid ${tempFilters.favourites ? 'transparent' : colors.cardBorder}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {tempFilters.favourites && <Check size={14} style={{ color: colors.buttonText }} />}
                  </div>
                </button>

                <button
                  onClick={() => setTempFilters({ ...tempFilters, verified: !tempFilters.verified })}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    Verified Users Only
                  </span>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{
                      background: tempFilters.verified ? colors.buttonGradient : 'transparent',
                      border: `2px solid ${tempFilters.verified ? 'transparent' : colors.cardBorder}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {tempFilters.verified && <Check size={14} style={{ color: colors.buttonText }} />}
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="imitr-ripple flex-1 rounded-xl px-4 py-3.5"
                  style={{
                    background: colors.cardBg,
                    color: colors.text,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    border: `1px solid ${colors.cardBorder}`,
                    fontWeight: 600,
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="imitr-ripple flex-1 rounded-xl px-4 py-3.5"
                  style={{
                    background: colors.buttonGradient,
                    color: colors.buttonText,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: `0 4px 20px ${colors.glowColor}`,
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}