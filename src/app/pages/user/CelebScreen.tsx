import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Crown,
  Star,
  Heart,
  Play,
  Phone,
  Video,
  BadgeCheck,
  TrendingUp,
  Flame,
  Sparkles,
  ChevronRight,
  Users,
  Eye,
  MapPin,
  Globe,
  Briefcase,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { BottomNav } from '../../components/imitr/BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../../components/imitr/ThemeToggle';
import { PremiumGateOverlay } from '../../components/imitr/PremiumGate';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const categories = [
  { id: 'all', label: 'All Stars', icon: Sparkles },
  { id: 'actor', label: 'Actors', icon: Star },
  { id: 'actress', label: 'Actress', icon: Star },
  { id: 'singer', label: 'Musicians', icon: Play },
  { id: 'influencer', label: 'Influencers', icon: TrendingUp },
  { id: 'athlete', label: 'Athletes', icon: Flame },
];

export function CelebScreen() {
  const { colors, theme } = useTheme();
  const { isPremium, celebrities } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [likedCelebs, setLikedCelebs] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  // Show premium gate after 5 seconds for free users
  React.useEffect(() => {
    if (isPremium) return;
    const timer = setTimeout(() => {
      setShowPremiumGate(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isPremium]);

  // Dynamic data derived from context celebrities
  const activeCelebs = useMemo(() =>
    celebrities.filter(c => c.status === 'active'),
    [celebrities]
  );

  // Featured celeb: highest rating, prefer live, then online
  const featuredCeleb = useMemo(() => {
    if (activeCelebs.length === 0) return null;
    const liveCelebs = activeCelebs.filter(c => c.isLive);
    if (liveCelebs.length > 0) return liveCelebs.sort((a, b) => b.rating - a.rating)[0];
    const onlineCelebs = activeCelebs.filter(c => c.isOnline);
    if (onlineCelebs.length > 0) return onlineCelebs.sort((a, b) => b.rating - a.rating)[0];
    return activeCelebs.sort((a, b) => b.rating - a.rating)[0];
  }, [activeCelebs]);

  // Trending: top 3 by totalCalls (excluding featured)
  const trendingCelebs = useMemo(() =>
    activeCelebs
      .filter(c => c.id !== featuredCeleb?.id)
      .sort((a, b) => b.totalCalls - a.totalCalls)
      .slice(0, 3),
    [activeCelebs, featuredCeleb]
  );

  // Grid: all active celebs excluding featured, filtered by category
  const celebGrid = useMemo(() => {
    let filtered = activeCelebs.filter(c => c.id !== featuredCeleb?.id);
    if (activeCategory !== 'all') {
      filtered = filtered.filter(c =>
        c.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    return filtered;
  }, [activeCelebs, featuredCeleb, activeCategory]);

  // Rising stars: newest celebs (by createdAt, most recent first)
  const risingStars = useMemo(() =>
    activeCelebs
      .filter(c => c.totalCalls < 500) // newer celebs with fewer calls
      .sort((a, b) => {
        // Sort by createdAt desc — simple string comparison works for our date format
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      })
      .slice(0, 3),
    [activeCelebs]
  );

  const onlineCount = activeCelebs.filter(c => c.isOnline).length;

  const toggleLike = (id: string) => {
    setLikedCelebs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <ScreenWrapper noPadding showThemeToggle={false}>
      <div className="px-5 pb-28 pt-6 imitr-page-enter">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown size={20} style={{ color: colors.primary }} />
            <span
              style={{
                color: colors.primary,
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Celebrity Lounge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <GlassCard className="flex items-center gap-2 px-3 py-2">
              <Users size={14} style={{ color: colors.primary }} />
              <span className="whitespace-nowrap" style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                {onlineCount} Online
              </span>
            </GlassCard>
            <ThemeToggle />
          </div>
        </div>

        <h2 className="mb-5" style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>
          Discover Stars
        </h2>

        {/* FEATURED CELEB - Hero Card */}
        {featuredCeleb && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-7 overflow-hidden rounded-3xl"
            style={{
              border: `1.5px solid ${colors.cardBorder}`,
            }}
          >
            <div className="relative h-[340px] w-full" onClick={() => featuredCeleb && navigate(`/celeb/${featuredCeleb.id}`)}>
              <ImageWithFallback
                src={featuredCeleb.image}
                alt={featuredCeleb.name}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, ${theme === 'night' ? '#022B22' : '#850222'} 0%, transparent 50%, ${theme === 'night' ? 'rgba(2,43,34,0.3)' : 'rgba(133,2,34,0.3)'} 100%)`,
                }}
              />
              {featuredCeleb.isLive && (
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{
                    background: 'rgba(255,77,77,0.9)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 0 20px rgba(255,77,77,0.5)',
                  }}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  <span style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '1px' }}>
                    LIVE
                  </span>
                </div>
              )}
              <button
                onClick={() => toggleLike(featuredCeleb.id)}
                className="imitr-ripple absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Heart
                  size={18}
                  fill={likedCelebs.has(featuredCeleb.id) ? colors.danger : 'none'}
                  style={{ color: likedCelebs.has(featuredCeleb.id) ? colors.danger : '#fff' }}
                />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '1px' }}>
                    {featuredCeleb.category.toUpperCase()}
                  </span>
                  {featuredCeleb.isVerified && <BadgeCheck size={14} style={{ color: colors.primary }} />}
                  {featuredCeleb.isPremium && (
                    <span className="rounded-full px-2 py-0.5" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', fontSize: '8px', fontFamily: "'Inter', sans-serif", color: '#fff', letterSpacing: '0.5px' }}>
                      PREMIUM
                    </span>
                  )}
                </div>
                <h3 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '4px' }}>
                  {featuredCeleb.name}
                </h3>
                {/* Age, City, Languages */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {featuredCeleb.age && (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      {featuredCeleb.age} yrs
                    </span>
                  )}
                  {featuredCeleb.city && (
                    <span className="flex items-center gap-0.5" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      <MapPin size={10} /> {featuredCeleb.city}
                    </span>
                  )}
                  {featuredCeleb.experience && (
                    <span className="flex items-center gap-0.5" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      <Briefcase size={10} /> {featuredCeleb.experience} yrs exp
                    </span>
                  )}
                  {featuredCeleb.languages && featuredCeleb.languages.length > 0 && (
                    <span className="flex items-center gap-0.5" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      <Globe size={10} /> {featuredCeleb.languages.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
                {/* Speciality & Social */}
                {(featuredCeleb.speciality || featuredCeleb.instagram || featuredCeleb.youtube) && (
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {featuredCeleb.speciality && (
                      <span className="rounded-full px-2 py-0.5" style={{ background: `${colors.primary}25`, color: colors.primary, fontSize: '9px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.3px' }}>
                        {featuredCeleb.speciality}
                      </span>
                    )}
                    {featuredCeleb.instagram && (
                      <span className="flex items-center gap-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        <Instagram size={9} /> {featuredCeleb.instagram}
                      </span>
                    )}
                    {featuredCeleb.youtube && (
                      <span className="flex items-center gap-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        <Youtube size={9} /> {featuredCeleb.youtube}
                      </span>
                    )}
                  </div>
                )}
                {/* Available For chips */}
                {featuredCeleb.availableFor && featuredCeleb.availableFor.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {featuredCeleb.availableFor.map((svc) => (
                      <span
                        key={svc}
                        className="rounded-full px-2 py-0.5"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '9px',
                          fontFamily: "'Inter', sans-serif",
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                      {featuredCeleb.followers}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#FFD700" style={{ color: '#FFD700' }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                      {featuredCeleb.rating}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredCeleb.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '10px',
                          fontFamily: "'Inter', sans-serif",
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/pre-call/${featuredCeleb.id}/video`); }}
                    className="imitr-ripple flex flex-1 items-center justify-center gap-2 rounded-2xl py-3"
                    style={{
                      background: colors.buttonGradient,
                      boxShadow: `0 4px 20px ${colors.glowColor}`,
                    }}
                  >
                    <Video size={16} style={{ color: colors.buttonText }} />
                    <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                      Video Call
                    </span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/pre-call/${featuredCeleb.id}/audio`); }}
                    className="imitr-ripple flex items-center justify-center rounded-2xl px-5 py-3"
                  >
                    <Phone size={16} style={{ color: colors.primary }} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TRENDING TOP 3 */}
        {trendingCelebs.length > 0 && (
          <div className="mb-7">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={18} style={{ color: colors.primary }} />
                <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>
                  Trending Now
                </span>
              </div>
              <button className="flex items-center gap-1">
                <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  View All
                </span>
                <ChevronRight size={14} style={{ color: colors.primary }} />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 imitr-scroll" ref={scrollRef}>
              {trendingCelebs.map((celeb, i) => (
                <motion.div
                  key={celeb.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="relative min-w-[160px] flex-shrink-0"
                >
                  <GlassCard
                    className="overflow-hidden p-0"
                    onClick={() => navigate(`/celeb/${celeb.id}`)}
                  >
                    <div
                      className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${rankColors[i] || '#888'}, ${rankColors[i] || '#888'}88)`,
                        boxShadow: `0 2px 10px ${rankColors[i] || '#888'}66`,
                      }}
                    >
                      <span style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                        #{i + 1}
                      </span>
                    </div>
                    <div className="relative h-[200px]">
                      <ImageWithFallback
                        src={celeb.image}
                        alt={celeb.name}
                        className="h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(0deg, ${theme === 'night' ? 'rgba(1,21,16,0.95)' : 'rgba(58,0,14,0.95)'} 0%, transparent 60%)`,
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="mb-0.5 flex items-center gap-1">
                          <span style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                            {celeb.name}
                          </span>
                          {celeb.isVerified && <BadgeCheck size={12} style={{ color: colors.primary }} />}
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                          {celeb.category} &middot; {celeb.city || celeb.followers}
                        </span>
                        {celeb.experience && (
                          <span className="ml-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif", fontSize: '9px' }}>
                            &middot; {celeb.experience}yr exp
                          </span>
                        )}
                        <div className="mt-2 flex items-center gap-1">
                          <Star size={10} fill="#FFD700" style={{ color: '#FFD700' }} />
                          <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                            {celeb.rating} &middot; {celeb.coinRate} coins/min
                          </span>
                        </div>
                        {celeb.isPremium && (
                          <span className="mt-1 inline-block rounded-full px-2 py-0.5" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', fontSize: '7px', fontFamily: "'Inter', sans-serif", color: '#fff', letterSpacing: '0.5px' }}>
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORY FILTERS */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 imitr-scroll">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="imitr-ripple flex flex-shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2.5"
                style={{
                  background: isActive ? colors.buttonGradient : colors.cardBg,
                  color: isActive ? colors.buttonText : colors.text,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isActive ? 'transparent' : colors.cardBorder,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 2px 12px ${colors.glowColor}` : 'none',
                }}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* CELEB GRID */}
        <div className="mb-7">
          {celebGrid.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {celebGrid.map((celeb, i) => (
                <motion.div
                  key={celeb.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={i % 3 === 0 ? 'row-span-1' : ''}
                >
                  <GlassCard
                    className="group relative overflow-hidden p-0"
                    onClick={() => navigate(`/celeb/${celeb.id}`)}
                  >
                    <div className={`relative ${i % 3 === 0 ? 'h-[220px]' : 'h-[180px]'}`}>
                      <ImageWithFallback
                        src={celeb.image}
                        alt={celeb.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(0deg, ${theme === 'night' ? 'rgba(1,21,16,0.9)' : 'rgba(58,0,14,0.9)'} 0%, transparent 55%)`,
                        }}
                      />

                      {celeb.isOnline && (
                        <div
                          className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-1"
                          style={{
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: colors.success, boxShadow: `0 0 6px ${colors.success}` }}
                          />
                          <span style={{ color: '#fff', fontSize: '9px', fontFamily: "'Inter', sans-serif" }}>
                            Online
                          </span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(celeb.id);
                        }}
                        className="absolute left-3 top-3"
                      >
                        <Heart
                          size={16}
                          fill={likedCelebs.has(celeb.id) ? colors.danger : 'none'}
                          style={{ color: likedCelebs.has(celeb.id) ? colors.danger : 'rgba(255,255,255,0.6)' }}
                        />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1">
                          <span style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                            {celeb.name}
                          </span>
                          {celeb.isVerified && <BadgeCheck size={11} style={{ color: colors.primary }} />}
                          {celeb.isPremium && (
                            <span className="rounded-full px-1.5 py-0.5" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', fontSize: '6px', fontFamily: "'Inter', sans-serif", color: '#fff', letterSpacing: '0.3px' }}>
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                            {celeb.age ? `${celeb.age} yrs` : celeb.category}
                            {celeb.city ? ` · ${celeb.city}` : ` · ${celeb.followers}`}
                            {celeb.experience ? ` · ${celeb.experience}yr` : ''}
                          </span>
                        </div>
                        {celeb.speciality && (
                          <div className="mt-0.5">
                            <span className="rounded-full px-1.5 py-0.5" style={{ background: `${colors.primary}20`, color: colors.primary, fontSize: '8px', fontFamily: "'Inter', sans-serif" }}>
                              {celeb.speciality}
                            </span>
                          </div>
                        )}
                        {celeb.languages && celeb.languages.length > 0 && (
                          <div className="mt-0.5 flex items-center gap-0.5">
                            <Globe size={8} style={{ color: 'rgba(255,255,255,0.4)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif", fontSize: '9px' }}>
                              {celeb.languages.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="mt-1.5 flex items-center justify-between">
                          <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                            {celeb.coinRate} coins/min
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/pre-call/${celeb.id}/audio`); }}
                              className="flex h-6 w-6 items-center justify-center rounded-full"
                              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
                            >
                              <Phone size={10} style={{ color: colors.primary }} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/pre-call/${celeb.id}/video`); }}
                              className="flex h-6 w-6 items-center justify-center rounded-full"
                              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
                            >
                              <Video size={10} style={{ color: colors.primary }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-12">
              <Crown size={36} style={{ color: colors.inactive, marginBottom: '12px' }} />
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                No celebrities in this category
              </p>
            </div>
          )}
        </div>

        {/* RISING STARS */}
        {risingStars.length > 0 && (
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={18} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>
                Rising Stars
              </span>
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  background: `${colors.primary}22`,
                  color: colors.primary,
                  fontSize: '10px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                NEW
              </span>
            </div>

            {risingStars.map((star, i) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="mb-3"
              >
                <GlassCard className="flex items-center gap-4 p-3" onClick={() => navigate(`/celeb/${star.id}`)}>
                  <div className="relative">
                    <ImageWithFallback
                      src={star.image}
                      alt={star.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{
                        background: colors.buttonGradient,
                        boxShadow: `0 2px 8px ${colors.glowColor}`,
                      }}
                    >
                      <TrendingUp size={10} style={{ color: colors.buttonText }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                        {star.name}
                      </span>
                      {star.isVerified && <BadgeCheck size={13} style={{ color: colors.primary }} />}
                    </div>
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      {star.category}{star.city ? ` · ${star.city}` : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className="mb-0.5 rounded-full px-2 py-0.5"
                      style={{
                        background: 'rgba(76,175,80,0.15)',
                        color: colors.success,
                        fontSize: '11px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {star.followers}
                    </div>
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                      {star.coinRate} coins/min
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* STATS BAR */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-around">
            {[
              { label: 'Celebs', value: activeCelebs.length.toString(), icon: Crown },
              { label: 'Total Calls', value: activeCelebs.reduce((sum, c) => sum + c.totalCalls, 0).toLocaleString(), icon: Phone },
              { label: 'Active Now', value: onlineCount.toString(), icon: Eye },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <div
                    className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: `${colors.primary}15`,
                    }}
                  >
                    <Icon size={16} style={{ color: colors.primary }} />
                  </div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
                    {stat.value}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <BottomNav />
      {!isPremium && (
        <PremiumGateOverlay
          isOpen={showPremiumGate}
          onClose={() => {
            setShowPremiumGate(false);
            navigate('/home');
          }}
          feature="Celebrity Lounge"
        />
      )}
    </ScreenWrapper>
  );
}