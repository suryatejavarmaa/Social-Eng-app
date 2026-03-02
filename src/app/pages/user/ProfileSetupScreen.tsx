import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Camera, Calendar, MapPin } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function ProfileSetupScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { userName, userCity, userGender, userAge, setUserProfile } = useApp();
  const [name, setName] = useState(userName);
  const [city, setCity] = useState(userCity);
  const [gender, setGender] = useState(userGender);
  const [age, setAge] = useState(userAge);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 120)) {
      setAge(value);
    }
  };

  const handleContinue = () => {
    setUserProfile({ name, city, gender, age });
    navigate('/interests');
  };

  return (
    <ScreenWrapper>
      <div className="imitr-page-enter">
        <HeaderBar title="Profile Setup" showBack />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-8">
          <div className="mb-8 flex flex-col items-center">
            <div
              className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full imitr-breathe"
              style={{ background: colors.cardBg, border: `2px solid ${colors.primary}`, boxShadow: `0 0 24px ${colors.glowColor}` }}
            >
              <User size={36} style={{ color: colors.primary }} />
              <div
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full imitr-ripple"
                style={{ background: colors.buttonGradient }}
              >
                <Camera size={14} style={{ color: colors.buttonText }} />
              </div>
            </div>
            <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              Upload your photo
            </p>
          </div>

          <GlassCard className="p-5 imitr-fade-scale">
            <div className="flex flex-col gap-4">
              <PremiumInput label="Display Name" placeholder="Your display name" icon={<User size={18} />}
                value={name} onChange={(e) => setName(e.target.value)} />
              <PremiumInput label="Date of Birth" placeholder="DD/MM/YYYY" type="date" icon={<Calendar size={18} />} />
              <PremiumInput label="City" placeholder="Your city" icon={<MapPin size={18} />}
                value={city} onChange={(e) => setCity(e.target.value)} />

              <div>
                <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif" }}>
                  Gender
                </label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className="imitr-ripple flex-1 rounded-xl py-3"
                      style={{
                        background: gender === g ? `${colors.primary}20` : colors.cardBg,
                        border: `1px solid ${gender === g ? colors.primary : colors.border}`,
                        color: gender === g ? colors.primary : colors.text,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        transition: 'all 0.3s ease',
                        boxShadow: gender === g ? `0 0 12px ${colors.glowColor}` : 'none',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <PremiumInput label="Age (Optional)" placeholder="Your age" type="text" icon={<Calendar size={18} />}
                value={age} onChange={handleAgeChange} />

              <PremiumButton fullWidth onClick={handleContinue} className="mt-2" disabled={!name || !city}>
                Continue
              </PremiumButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}