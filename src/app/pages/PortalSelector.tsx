import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Users, Shield, Crown, ChevronRight, Sparkles, Star } from 'lucide-react';
import { ScreenWrapper } from '../components/imitr/ScreenWrapper';
import { GlassCard } from '../components/imitr/GlassCard';
import { ThemeToggle } from '../components/imitr/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const portals = [
  {
    id: 'user',
    title: 'User Login',
    subtitle: 'Login with your phone number via OTP',
    icon: Users,
    path: '/user-login',
    screens: 'OTP + Setup',
    gradient: 'linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))',
  },
  {
    id: 'celeb',
    title: 'Celebrity Login',
    subtitle: 'Login with your phone number via OTP',
    icon: Star,
    path: '/celeb-login',
    screens: 'OTP + Setup',
    gradient: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
  },
  {
    id: 'admin',
    title: 'Admin Login',
    subtitle: 'Login with your phone number via OTP',
    icon: Shield,
    path: '/admin-login',
    screens: 'OTP + Setup',
    gradient: 'linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))',
  },
  {
    id: 'superadmin',
    title: 'Super Admin',
    subtitle: 'System oversight, admin management, minting & integrations',
    icon: Crown,
    path: '/superadmin/dashboard',
    screens: '25 screens',
    gradient: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
  },
];

export function PortalSelector() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="imitr-gold-pulse mb-4 flex h-20 w-20 items-center justify-center rounded-3xl"
            style={{
              background: colors.buttonGradient,
              boxShadow: `0 8px 32px ${colors.glowColor}`,
            }}
          >
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: colors.buttonText }}>IM</span>
          </motion.div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: colors.text, fontSize: '32px', letterSpacing: '4px' }}>
            IMITR
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Sparkles size={12} style={{ color: colors.primary }} />
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Premium Ecosystem
            </p>
            <Sparkles size={12} style={{ color: colors.primary }} />
          </div>
        </div>

        {/* Portal Cards */}
        <div className="imitr-stagger flex flex-col gap-4 px-2">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <GlassCard
                key={portal.id}
                className="flex items-center gap-4 p-5"
                onClick={() => navigate(portal.path)}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: portal.gradient, flexShrink: 0, border: `1px solid ${colors.cardBorder}` }}
                >
                  <Icon size={26} style={{ color: colors.primary }} />
                </div>
                <div className="flex-1">
                  <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px', display: 'block' }}>
                    {portal.title}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', display: 'block', marginTop: '2px' }}>
                    {portal.subtitle}
                  </span>
                  
                </div>
                <ChevronRight size={20} style={{ color: colors.primary, flexShrink: 0 }} />
              </GlassCard>
            );
          })}
        </div>

        {/* Version */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', letterSpacing: '1px' }}>
            v2.0 • Premium Build
          </span>
        </div>
      </motion.div>
    </ScreenWrapper>
  );
}