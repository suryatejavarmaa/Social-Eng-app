import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  User, MapPin, Calendar, Globe, ChevronLeft, Camera, ImagePlus,
  X, Check, Sparkles, Save,
} from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { PremiumSelect } from '../../components/imitr/PremiumSelect';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function UserEditProfileScreen() {
  const { colors, theme } = useTheme();
  const navigate = useNavigate();
  const {
    userName, userPhone, userCity, userGender, userAge, userInterests,
    setUserProfile, isPremium,
  } = useApp();

  const [name, setName] = useState(userName || '');
  const [city, setCity] = useState(userCity || '');
  const [gender, setGender] = useState(userGender || '');
  const [age, setAge] = useState(userAge || '');
  const [interests, setInterests] = useState(userInterests?.join(', ') || '');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setUserProfile({
        name: name.trim(),
        city: city.trim(),
        gender,
        age,
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, [name, city, gender, age, interests, setUserProfile]);

  const initials = name.trim() ? name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-10 pt-4" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <ChevronLeft size={20} style={{ color: colors.primary }} />
          </button>
          <div className="flex-1">
            <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px' }}>
              Edit Profile
            </h1>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              Update your personal information
            </p>
          </div>
          {isPremium && (
            <span
              className="rounded-full px-2.5 py-1"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#fff',
                fontSize: '9px',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.5px',
              }}
            >
              PREMIUM
            </span>
          )}
        </div>

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <GlassCard className="flex flex-col items-center p-6">
            <div
              className="relative mb-4 cursor-pointer overflow-hidden rounded-full"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100px',
                height: '100px',
                background: avatar ? 'transparent' : colors.buttonGradient,
                boxShadow: `0 4px 24px ${colors.glowColor}`,
                border: `3px solid ${colors.primary}40`,
              }}
            >
              {avatar ? (
                <>
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    <Camera size={24} style={{ color: '#fff' }} />
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span style={{ color: colors.buttonText, fontFamily: "'Playfair Display', serif", fontSize: '32px' }}>
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2"
                style={{
                  background: `${colors.primary}15`,
                  border: `1px solid ${colors.primary}30`,
                  color: colors.primary,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                <Camera size={12} />
                {avatar ? 'Change Photo' : 'Upload Photo'}
              </button>
              {avatar && (
                <button
                  onClick={() => setAvatar('')}
                  className="flex items-center gap-1 rounded-xl px-3 py-2"
                  style={{
                    background: `${colors.danger}10`,
                    border: `1px solid ${colors.danger}20`,
                    color: colors.danger,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} /> Remove
                </button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassCard className="mb-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
                Personal Details
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <PremiumInput
                label="Full Name *"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={16} />}
              />

              <PremiumInput
                label="Phone Number"
                placeholder="+91"
                value={userPhone}
                onChange={() => {}}
                disabled
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <PremiumInput
                  label="Age"
                  placeholder="e.g. 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  icon={<Calendar size={16} />}
                />
                <PremiumInput
                  label="City"
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  icon={<MapPin size={16} />}
                />
              </div>

              <PremiumSelect
                label="Gender"
                placeholder="Select gender"
                value={gender}
                onChange={(val) => setGender(val)}
                icon={<User size={16} />}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <PremiumInput
                label="Interests"
                placeholder="Movies, Music, Sports (comma separated)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                icon={<Globe size={16} />}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <PremiumButton fullWidth onClick={handleSave} disabled={saving || !name.trim()}>
            <div className="flex items-center justify-center gap-2">
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full" style={{ border: `2px solid ${colors.buttonText}`, borderTopColor: 'transparent' }} />
              ) : saved ? (
                <Check size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Changes'}
            </div>
          </PremiumButton>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}
