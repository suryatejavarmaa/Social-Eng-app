import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const interests = [
  'Business', 'Technology', 'Finance', 'Music', 'Travel', 'Fitness',
  'Photography', 'Art', 'Cooking', 'Reading', 'Sports', 'Gaming',
  'Fashion', 'Movies', 'Science', 'Meditation',
];

export function InterestsScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { userInterests, setUserProfile } = useApp();
  const [selected, setSelected] = useState<string[]>(userInterests);

  const toggle = (i: string) => {
    setSelected((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const handleContinue = () => {
    setUserProfile({ interests: selected });
    navigate('/terms');
  };

  return (
    <ScreenWrapper noPadding className="flex min-h-screen flex-col">
      <div className="px-5 pt-6">
        <HeaderBar title="Your Interests" showBack />
      </div>
      <div className="flex flex-1 flex-col justify-center px-5 py-12">
        <div className="my-auto">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginBottom: '24px' }}>
            Select at least 3 interests to personalize your experience
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            {interests.map((interest) => {
              const isSelected = selected.includes(interest);
              return (
                <motion.button
                  key={interest}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(interest)}
                  className="rounded-2xl px-4 py-2.5"
                  style={{
                    background: isSelected ? colors.buttonGradient : colors.cardBg,
                    border: `1px solid ${isSelected ? colors.primary : colors.cardBorder}`,
                    color: isSelected ? colors.buttonText : colors.text,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {interest}
                </motion.button>
              );
            })}
          </div>
          <PremiumButton fullWidth onClick={handleContinue} disabled={selected.length < 3}>
            Continue ({selected.length} selected)
          </PremiumButton>
        </div>
      </div>
    </ScreenWrapper>
  );
}