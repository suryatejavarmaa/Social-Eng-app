import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, Star, Phone, Video, BadgeCheck, Coins, Heart, SlidersHorizontal, Bell, Lock, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { BottomNav } from '../../components/imitr/BottomNav';
import { FilterModal, FilterOptions } from '../../components/imitr/FilterModal';
import { PremiumGateOverlay, usePremiumGate } from '../../components/imitr/PremiumGate';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockUsers';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function HomeScreen() {
  const { colors } = useTheme();
  const { coinBalance, userName, favourites, toggleFavourite, isPremium, unreadNotifications } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [pendingUnfavourite, setPendingUnfavourite] = useState<string | null>(null);
  const { showGate, gateFeature, setShowGate, requirePremium } = usePremiumGate();
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    status: 'all',
    gender: 'all',
    favourites: false,
    verified: false,
    ageRange: [18, 50],
    minRating: 0,
    maxDistance: null,
  });

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((u) => {
      // Search filter
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      // Status filter
      if (advancedFilters.status === 'online' && !u.online) return false;
      if (advancedFilters.status === 'offline' && u.online) return false;

      // Gender filter
      if (advancedFilters.gender === 'male' && u.gender !== 'Male') return false;
      if (advancedFilters.gender === 'female' && u.gender !== 'Female') return false;

      // Favourites filter
      if (advancedFilters.favourites && !favourites.includes(u.id)) return false;

      // Verified filter
      if (advancedFilters.verified && !u.verified) return false;

      // Age range filter
      if (u.age < advancedFilters.ageRange[0] || u.age > advancedFilters.ageRange[1]) return false;

      // Rating filter
      if (u.rating < advancedFilters.minRating) return false;

      // Distance filter
      if (advancedFilters.maxDistance !== null && u.distanceKm > advancedFilters.maxDistance) return false;

      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm); // Sort by distance - nearest first
  }, [search, advancedFilters, favourites]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
  };

  // Quick filter handlers
  const handleQuickFilter = (type: string, value?: any) => {
    if (type === 'all') {
      setAdvancedFilters({
        status: 'all',
        gender: 'all',
        favourites: false,
        verified: false,
        ageRange: [18, 50],
        minRating: 0,
        maxDistance: null,
      });
    } else if (type === 'online') {
      // Toggle online filter - if already online, go back to all
      if (advancedFilters.status === 'online') {
        setAdvancedFilters({ ...advancedFilters, status: 'all' });
      } else {
        setAdvancedFilters({ ...advancedFilters, status: 'online' });
      }
    } else if (type === 'favourites') {
      // Toggle favourites filter
      setAdvancedFilters({ ...advancedFilters, favourites: !advancedFilters.favourites });
    } else if (type === 'male') {
      setAdvancedFilters({ ...advancedFilters, gender: 'male' });
    } else if (type === 'female') {
      setAdvancedFilters({ ...advancedFilters, gender: 'female' });
    } else if (type === 'distance') {
      setAdvancedFilters({ ...advancedFilters, maxDistance: value });
    }
  };

  // Active filter count for badge
  const activeFilterCount = [
    advancedFilters.status !== 'all',
    advancedFilters.gender !== 'all',
    advancedFilters.favourites,
    advancedFilters.verified,
    advancedFilters.minRating > 0,
    advancedFilters.ageRange[0] !== 18 || advancedFilters.ageRange[1] !== 50,
    advancedFilters.maxDistance !== null,
  ].filter(Boolean).length;

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between" style={{ paddingTop: '6px' }}>
          <div>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              {getGreeting()}
            </p>
            <div className="flex items-center gap-2">
              <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>{userName.split(' ')[0]}</h2>
              {isPremium ? (
                <BadgeCheck size={18} style={{ color: colors.primary, filter: `drop-shadow(0 0 4px ${colors.glowColor})` }} />
              ) : (
                <span className="rounded-full px-2 py-0.5"
                  style={{ background: `${colors.primary}15`, fontSize: '8px', fontFamily: "'Inter', sans-serif", color: colors.primary, letterSpacing: '0.5px' }}>
                  FREE
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GlassCard className="flex items-center gap-1.5 px-3 py-1.5" onClick={() => navigate('/wallet')}>
              <Coins size={14} style={{ color: colors.primary }} />
              <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                {coinBalance.toLocaleString()}
              </span>
            </GlassCard>
            <div className="relative">
              <button
                onClick={() => navigate('/notifications')}
                className="imitr-ripple flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
              >
                <Bell size={16} style={{ color: colors.primary }} />
              </button>
              {unreadNotifications > 0 && (
                <span
                  className="flex items-center justify-center rounded-full px-1 pointer-events-none"
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    height: '16px',
                    minWidth: '16px',
                    background: colors.danger,
                    fontSize: '8px',
                    fontFamily: "'Inter', sans-serif",
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: `0 2px 6px ${colors.danger}80`,
                    zIndex: 50,
                  }}
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <PremiumInput
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
            rightIcon={
              <div className="relative">
                <SlidersHorizontal size={18} />
                {activeFilterCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 rounded-full px-1.5 py-0.5"
                    style={{
                      background: '#FF4D4D',
                      color: '#fff',
                      fontSize: '9px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      minWidth: '16px',
                      textAlign: 'center',
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>
            }
            onRightIconClick={() => setShowFilterModal(true)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="mb-5 -mx-5 px-5 flex gap-3 overflow-x-auto">
          {(['all', 'online', 'favourites', 'male', 'female'] as const).map((f) => {
            const isActive =
              (f === 'all' && advancedFilters.status === 'all' && advancedFilters.gender === 'all' && !advancedFilters.favourites) ||
              (f === 'online' && advancedFilters.status === 'online') ||
              (f === 'favourites' && advancedFilters.favourites) ||
              (f === 'male' && advancedFilters.gender === 'male') ||
              (f === 'female' && advancedFilters.gender === 'female');

            return (
              <button
                key={f}
                onClick={() => handleQuickFilter(f)}
                className="imitr-ripple flex-shrink-0 rounded-xl px-4 py-2"
                style={{
                  background: isActive ? colors.buttonGradient : colors.cardBg,
                  color: isActive ? colors.buttonText : colors.text,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  border: `1px solid ${isActive ? 'transparent' : colors.cardBorder}`,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 2px 12px ${colors.glowColor}` : 'none',
                }}
              >
                {f === 'all' ? 'All Users' : f === 'online' ? 'Online Now' : f === 'favourites' ? '❤ Favourites' : f === 'male' ? 'Male' : 'Female'}
              </button>
            );
          })}
          
          {/* Distance Quick Filters — Premium only */}
          {[
            { label: '📍 Near (300m)', value: 0.3 },
            { label: '📍 500m', value: 0.5 },
            { label: '📍 1km', value: 1 },
            { label: '📍 5km', value: 5 },
          ].map((distance) => {
            const isActive = advancedFilters.maxDistance === distance.value;
            return (
              <button
                key={distance.value}
                onClick={() => {
                  if (!isPremium) {
                    requirePremium('Location Filtering');
                    return;
                  }
                  handleQuickFilter('distance', distance.value);
                }}
                className="imitr-ripple relative flex-shrink-0 rounded-xl px-4 py-2"
                style={{
                  background: isActive ? colors.buttonGradient : colors.cardBg,
                  color: isActive ? colors.buttonText : colors.text,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  border: `1px solid ${isActive ? 'transparent' : colors.cardBorder}`,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 2px 12px ${colors.glowColor}` : 'none',
                  opacity: isPremium ? 1 : 0.6,
                }}
              >
                {!isPremium && <Lock size={10} className="mr-1 inline" style={{ color: colors.primary }} />}
                {distance.label}
              </button>
            );
          })}
        </div>

        {/* User Grid */}
        <div className="imitr-stagger grid grid-cols-2 gap-3">
          {filteredUsers.map((user) => (
            <GlassCard
              key={user.id}
              className="overflow-hidden"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <div className="relative">
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.name}
                  className="h-44 w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7) 100%)' }}
                />
                {user.online && (
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ background: 'rgba(76,175,80,0.9)' }}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: 'badgePulse 2s ease-in-out infinite' }} />
                    <span style={{ color: '#fff', fontSize: '9px', fontFamily: "'Inter', sans-serif" }}>Live</span>
                  </div>
                )}
                {/* Premium badge */}
                {user.isPremium && (
                  <div
                    className="absolute left-2 flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{
                      top: '8px',
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      boxShadow: '0 2px 8px rgba(255,165,0,0.4)',
                    }}
                  >
                    <Crown size={8} style={{ color: '#fff' }} />
                    <span style={{ color: '#fff', fontSize: '8px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px' }}>
                      PRO
                    </span>
                  </div>
                )}
                {/* Favourite button */}
                <button
                  className="absolute right-2 bottom-12"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const isFavourite = favourites.includes(user.id);
                    
                    if (isFavourite) {
                      // Unfavouriting - show undo toast
                      setPendingUnfavourite(user.id);
                      toggleFavourite(user.id);
                      
                      toast.custom(
                        (t) => (
                          <div 
                            className="flex items-center gap-3 rounded-xl px-4 py-3"
                            style={{
                              background: colors.cardBg,
                              border: `1px solid ${colors.cardBorder}`,
                              backdropFilter: 'blur(20px)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            }}
                          >
                            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                              Removed from favourites
                            </span>
                            <button
                              onClick={() => {
                                toggleFavourite(user.id); // Re-add to favourites
                                setPendingUnfavourite(null);
                                toast.dismiss(t);
                              }}
                              className="imitr-ripple rounded-lg px-3 py-1.5"
                              style={{
                                background: colors.buttonGradient,
                                color: colors.buttonText,
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '13px',
                                fontWeight: 600,
                              }}
                            >
                              Undo
                            </button>
                          </div>
                        ),
                        { 
                          duration: 4000,
                          onDismiss: () => setPendingUnfavourite(null),
                          onAutoClose: () => setPendingUnfavourite(null),
                        }
                      );
                    } else {
                      // Favouriting - just toggle
                      toggleFavourite(user.id);
                    }
                  }}
                >
                  <Heart
                    size={18}
                    fill={favourites.includes(user.id) ? '#FF4D4D' : 'transparent'}
                    style={{
                      color: favourites.includes(user.id) ? '#FF4D4D' : 'rgba(255,255,255,0.6)',
                      transition: 'all 0.3s ease',
                      filter: favourites.includes(user.id) ? 'drop-shadow(0 0 6px rgba(255,77,77,0.5))' : 'none',
                    }}
                  />
                </button>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1">
                    <p className="truncate" style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>{user.name}</p>
                    {user.isPremium && (
                      <BadgeCheck size={14} style={{ color: colors.primary, filter: `drop-shadow(0 0 4px ${colors.glowColor})`, flexShrink: 0 }} />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                      {user.age} • {user.city}
                    </span>
                    <Star size={10} style={{ color: colors.primary, marginLeft: '4px' }} />
                    <span style={{ color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{user.rating}</span>
                  </div>
                  {/* Distance Badge */}
                  <div className="mt-1 flex items-center gap-1">
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                      📍 {user.distanceKm < 1 ? `${(user.distanceKm * 1000).toFixed(0)}m` : `${user.distanceKm.toFixed(1)}km`} away
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-1">
                  <Coins size={12} style={{ color: colors.primary }} />
                  <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                    {user.callRate.audio}/min
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="imitr-ripple relative flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${colors.primary}20` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPremium) {
                        requirePremium('Audio Call');
                        return;
                      }
                      navigate(`/pre-call/${user.id}/audio`);
                    }}
                  >
                    <Phone size={12} style={{ color: colors.primary }} />
                  </button>
                  <button
                    className="imitr-ripple flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${colors.primary}20` }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/pre-call/${user.id}/video`); }}
                  >
                    <Video size={12} style={{ color: colors.primary }} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Search size={40} style={{ color: colors.inactive, marginBottom: '12px' }} />
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>No users found</p>
          </div>
        )}
      </div>
      <BottomNav />
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={advancedFilters}
        onApply={handleApplyFilters}
      />
      <PremiumGateOverlay
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        feature={gateFeature}
      />
    </ScreenWrapper>
  );
}