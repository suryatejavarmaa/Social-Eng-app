import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { Check } from 'lucide-react';

export function TermsScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <ScreenWrapper noPadding className="flex min-h-screen flex-col">
      <div className="px-5 pt-6">
        <HeaderBar title="Terms & Conditions" showBack />
      </div>
      <div className="flex flex-1 flex-col justify-center px-5 py-12">
        <div className="my-auto">
          <GlassCard className="mb-6 max-h-96 overflow-y-auto imitr-scroll p-5">
            <div style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.8' }}>
              <p className="mb-4" style={{ color: colors.text }}>IMITR Platform Agreement</p>
              <p className="mb-3">By using IMITR, you agree to our terms of service, privacy policy, and community guidelines.</p>
              <p className="mb-3">1. IMITR is a monetized communication platform. All calls are billed using the coin system.</p>
              <p className="mb-3">2. Coins are purchased through authorized payment channels. Coins are non-refundable once used.</p>
              <p className="mb-3">3. Diamonds earned through received calls can be converted to real currency through our withdrawal system.</p>
              <p className="mb-3">4. Users must maintain respectful communication. Violations may result in permanent account suspension.</p>
              <p className="mb-3">5. All transactions are logged and auditable by platform administrators.</p>
              <p className="mb-3">6. IMITR reserves the right to modify pricing structures with prior notice.</p>
              <p className="mb-3">7. User data is processed in accordance with applicable data protection regulations.</p>
            </div>
          </GlassCard>

          <button
            onClick={() => setAccepted(!accepted)}
            className="mb-6 flex items-center gap-3"
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg"
              style={{
                background: accepted ? colors.buttonGradient : 'transparent',
                border: `1.5px solid ${accepted ? colors.primary : colors.border}`,
              }}
            >
              {accepted && <Check size={14} style={{ color: colors.buttonText }} />}
            </div>
            <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
              I accept the Terms & Conditions
            </span>
          </button>

          <PremiumButton fullWidth onClick={() => navigate('/permissions')} disabled={!accepted}>
            Accept & Continue
          </PremiumButton>
        </div>
      </div>
    </ScreenWrapper>
  );
}