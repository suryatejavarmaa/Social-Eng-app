import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, Mic, Bell, MapPin, Check } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';

const permissions = [
  { icon: Mic, label: 'Microphone', desc: 'Required for audio calls', required: true },
  { icon: Camera, label: 'Camera', desc: 'Required for video calls', required: true },
  { icon: Bell, label: 'Notifications', desc: 'Receive call & coin alerts', required: false },
  { icon: MapPin, label: 'Location', desc: 'Show nearby users', required: false },
];

export function PermissionsScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [granted, setGranted] = useState<string[]>([]);

  const toggle = (label: string) => {
    setGranted((prev) => prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]);
  };

  const requiredGranted = permissions.filter((p) => p.required).every((p) => granted.includes(p.label));

  return (
    <ScreenWrapper noPadding className="flex min-h-screen flex-col">
      <div className="px-5 pt-6">
        <HeaderBar title="Permissions" showBack />
      </div>
      <div className="flex flex-1 flex-col justify-center px-5 py-12">
        <div className="my-auto">
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginBottom: '24px' }}>
            Grant access to enable core features
          </p>

          <div className="mb-8 flex flex-col gap-3">
            {permissions.map((perm) => {
              const Icon = perm.icon;
              const isGranted = granted.includes(perm.label);
              return (
                <GlassCard key={perm.label} className="flex items-center justify-between p-4" onClick={() => toggle(perm.label)}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${colors.primary}15` }}
                    >
                      <Icon size={20} style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                        {perm.label}
                        {perm.required && <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>}
                      </span>
                      <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                        {perm.desc}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-lg"
                    style={{
                      background: isGranted ? colors.buttonGradient : 'transparent',
                      border: `1.5px solid ${isGranted ? colors.primary : colors.border}`,
                    }}
                  >
                    {isGranted && <Check size={14} style={{ color: colors.buttonText }} />}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <PremiumButton fullWidth onClick={() => navigate('/welcome')} disabled={!requiredGranted}>
            Continue
          </PremiumButton>
        </div>
      </div>
    </ScreenWrapper>
  );
}