import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Star, ChevronLeft, Camera, X, Check, Save, User,
  MapPin, Calendar, Globe, Award, Instagram, Briefcase,
  Youtube, Twitter, Video, Mic, Handshake, Radio,
  Crown, BadgeCheck, Users2,
} from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { PremiumSelect } from '../../components/imitr/PremiumSelect';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function CelebEditProfileScreen() {
  const { colors, theme } = useTheme();
  const navigate = useNavigate();
  const { celebrities, updateCelebrity } = useApp();

  // Find logged-in celebrity (first active one for demo, or match via phone/state)
  const celeb = useMemo(() => celebrities.find(c => c.status === 'active' && c.profileCompleted) || celebrities[0], [celebrities]);

  const [displayName, setDisplayName] = useState(celeb?.name || '');
  const [celebAge, setCelebAge] = useState(celeb?.age?.toString() || '');
  const [celebCity, setCelebCity] = useState(celeb?.city || '');
  const [celebGender, setCelebGender] = useState<string>(celeb?.gender || '');
  const [celebCategory, setCelebCategory] = useState(celeb?.category || '');
  const [celebSpeciality, setCelebSpeciality] = useState(celeb?.speciality || '');
  const [celebBio, setCelebBio] = useState(celeb?.bio || '');
  const [celebLanguages, setCelebLanguages] = useState(celeb?.languages?.join(', ') || '');
  const [celebInstagram, setCelebInstagram] = useState(celeb?.instagram || '');
  const [celebExperience, setCelebExperience] = useState(celeb?.experience?.toString() || '');
  const [celebYoutube, setCelebYoutube] = useState(celeb?.youtube || '');
  const [celebTwitter, setCelebTwitter] = useState(celeb?.twitter || '');
  const [celebAvailableFor, setCelebAvailableFor] = useState<string[]>(celeb?.availableFor || []);
  const [celebImage, setCelebImage] = useState(celeb?.image || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onloadend = () => setCelebImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    if (!celeb || !displayName.trim()) return;
    setSaving(true);
    setTimeout(() => {
      updateCelebrity(celeb.id, {
        name: displayName.trim(),
        age: celebAge ? parseInt(celebAge) : undefined,
        city: celebCity.trim(),
        gender: celebGender as any,
        category: celebCategory,
        speciality: celebSpeciality.trim(),
        bio: celebBio.trim(),
        languages: celebLanguages.split(',').map(s => s.trim()).filter(Boolean),
        instagram: celebInstagram.trim(),
        experience: celebExperience ? parseInt(celebExperience) : undefined,
        youtube: celebYoutube.trim(),
        twitter: celebTwitter.trim(),
        availableFor: celebAvailableFor,
        image: celebImage || celeb.image,
        isPremium: true,
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, [celeb, displayName, celebAge, celebCity, celebGender, celebCategory, celebSpeciality, celebBio, celebLanguages, celebInstagram, celebExperience, celebYoutube, celebTwitter, celebAvailableFor, celebImage, updateCelebrity]);

  if (!celeb) {
    return (
      <ScreenWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <Crown size={40} style={{ color: colors.inactive }} />
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", marginTop: '12px' }}>
            No celebrity profile found
          </p>
        </div>
      </ScreenWrapper>
    );
  }

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
              Edit Celebrity Profile
            </h1>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              Update your star profile
            </p>
          </div>
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
        </div>

        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <GlassCard className="flex flex-col items-center p-6">
            <div
              className="relative mb-3 cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '110px',
                height: '110px',
                border: `3px solid ${colors.primary}40`,
                boxShadow: `0 4px 24px ${colors.glowColor}`,
              }}
            >
              <ImageWithFallback
                src={celebImage}
                alt={displayName}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                <Camera size={24} style={{ color: '#fff' }} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="mb-2 flex items-center gap-1.5">
              <span style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px' }}>
                {displayName || 'Celebrity'}
              </span>
              {celeb.isVerified && <BadgeCheck size={14} style={{ color: colors.primary }} />}
            </div>
            <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
              {celeb.category} · ID: {celeb.id}
            </span>
            <div className="mt-3 flex gap-2">
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
                <Camera size={12} /> Change Photo
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassCard className="mb-5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Star size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
                Basic Information
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              <PremiumInput
                label="Display Name *"
                placeholder="Your stage/display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                icon={<User size={16} />}
              />

              <div className="grid grid-cols-2 gap-3">
                <PremiumInput
                  label="Age"
                  placeholder="e.g. 28"
                  value={celebAge}
                  onChange={(e) => setCelebAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  icon={<Calendar size={16} />}
                />
                <PremiumInput
                  label="City"
                  placeholder="e.g. Mumbai"
                  value={celebCity}
                  onChange={(e) => setCelebCity(e.target.value)}
                  icon={<MapPin size={16} />}
                />
              </div>

              <PremiumSelect
                label="Gender"
                placeholder="Select gender"
                value={celebGender}
                onChange={(val) => setCelebGender(val)}
                icon={<Users2 size={16} />}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <PremiumSelect
                label="Category"
                placeholder="Select category"
                value={celebCategory}
                onChange={(val) => setCelebCategory(val)}
                icon={<Star size={16} />}
                options={[
                  { value: 'Actor', label: 'Actor' },
                  { value: 'Actress', label: 'Actress' },
                  { value: 'Singer', label: 'Singer / Musician' },
                  { value: 'Influencer', label: 'Influencer' },
                  { value: 'Athlete', label: 'Athlete' },
                  { value: 'Comedian', label: 'Comedian' },
                  { value: 'Model', label: 'Model' },
                  { value: 'Director', label: 'Director / Producer' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <PremiumInput
                label="Speciality / Talent"
                placeholder="e.g. Method Acting, Playback Singing"
                value={celebSpeciality}
                onChange={(e) => setCelebSpeciality(e.target.value)}
                icon={<Award size={16} />}
              />

              <PremiumInput
                label="Experience (Years)"
                placeholder="e.g. 5"
                value={celebExperience}
                onChange={(e) => setCelebExperience(e.target.value.replace(/\D/g, '').slice(0, 2))}
                icon={<Briefcase size={16} />}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Bio & Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <GlassCard className="mb-5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Globe size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
                Bio & Languages
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              <div>
                <label style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginBottom: '6px', display: 'block' }}>
                  Bio
                </label>
                <textarea
                  placeholder="Tell your fans about yourself..."
                  value={celebBio}
                  onChange={(e) => setCelebBio(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl px-4 py-3"
                  style={{
                    background: colors.cardBg,
                    color: colors.text,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    border: `1px solid ${colors.cardBorder}`,
                    outline: 'none',
                    backdropFilter: 'blur(12px)',
                  }}
                />
              </div>

              <PremiumInput
                label="Languages"
                placeholder="Hindi, English, Tamil (comma separated)"
                value={celebLanguages}
                onChange={(e) => setCelebLanguages(e.target.value)}
                icon={<Globe size={16} />}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassCard className="mb-5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Instagram size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
                Social Links
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              <PremiumInput
                label="Instagram Handle"
                placeholder="@yourhandle"
                value={celebInstagram}
                onChange={(e) => setCelebInstagram(e.target.value)}
                icon={<Instagram size={16} />}
              />
              <div className="grid grid-cols-2 gap-3">
                <PremiumInput
                  label="YouTube"
                  placeholder="@channel"
                  value={celebYoutube}
                  onChange={(e) => setCelebYoutube(e.target.value)}
                  icon={<Youtube size={16} />}
                />
                <PremiumInput
                  label="Twitter / X"
                  placeholder="@handle"
                  value={celebTwitter}
                  onChange={(e) => setCelebTwitter(e.target.value)}
                  icon={<Twitter size={16} />}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Available For */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <GlassCard className="mb-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Video size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '0.5px' }}>
                Available For
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'Video Call', icon: Video },
                { value: 'Audio Call', icon: Mic },
                { value: 'Meet & Greet', icon: Handshake },
                { value: 'Live Session', icon: Radio },
              ].map((service) => {
                const isSelected = celebAvailableFor.includes(service.value);
                const Icon = service.icon;
                return (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => {
                      setCelebAvailableFor((prev) =>
                        isSelected
                          ? prev.filter((s) => s !== service.value)
                          : [...prev, service.value]
                      );
                    }}
                    className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5"
                    style={{
                      background: isSelected ? `${colors.primary}20` : colors.cardBg,
                      border: `1px solid ${isSelected ? colors.primary : colors.cardBorder}`,
                      color: isSelected ? colors.primary : colors.textSecondary,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 10px ${colors.glowColor}` : 'none',
                    }}
                  >
                    <Icon size={14} />
                    {service.value}
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <PremiumButton fullWidth onClick={handleSave} disabled={saving || !displayName.trim()}>
            <div className="flex items-center justify-center gap-2">
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full" style={{ border: `2px solid ${colors.buttonText}`, borderTopColor: 'transparent' }} />
              ) : saved ? (
                <Check size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Saving...' : saved ? 'Profile Updated!' : 'Save Changes'}
            </div>
          </PremiumButton>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}
