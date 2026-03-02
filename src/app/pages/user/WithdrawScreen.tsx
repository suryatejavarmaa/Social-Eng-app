import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Diamond, ArrowRight, Building2, AlertCircle } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp, DIAMOND_TO_RUPEE } from '../../context/AppContext';

export function WithdrawScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { diamondBalance, submitWithdraw, minWithdrawDiamonds, isPremium } = useApp();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const numAmount = parseInt(amount || '0');
  const rupeesValue = parseFloat((numAmount * DIAMOND_TO_RUPEE).toFixed(2));
  const isValid = numAmount >= minWithdrawDiamonds && numAmount <= diamondBalance && method.length > 3;

  const handleSubmit = () => {
    if (!isValid) return;
    setProcessing(true);
    setTimeout(() => {
      submitWithdraw(numAmount, method.includes('@') ? 'UPI' : 'Bank Transfer', method);
      setProcessing(false);
      navigate('/withdraw-status');
    }, 1200);
  };

  return (
    <ScreenWrapper>
      <div className="imitr-page-enter">
        <HeaderBar title="Withdraw" showBack />

        <GlassCard className="mb-5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Available</p>
              <span className="flex items-center gap-2 imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
                <Diamond size={20} style={{ color: colors.primary }} /> {diamondBalance.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>Value (₹{DIAMOND_TO_RUPEE}/diamond)</p>
              <span style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '18px' }}>
                ₹{(diamondBalance * DIAMOND_TO_RUPEE).toLocaleString()}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Quick amounts */}
        <div className="mb-4 flex gap-2">
          {[100, 200, 500].filter(v => v <= diamondBalance).map((v) => (
            <GlassCard key={v} className="imitr-ripple flex-1 p-2 text-center" onClick={() => setAmount(v.toString())}
              style={numAmount === v ? { borderColor: colors.primary, boxShadow: `0 0 12px ${colors.glowColor}` } : {}}>
              <span style={{ color: colors.primary, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{v}</span>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                ₹{(v * DIAMOND_TO_RUPEE).toLocaleString()}
              </span>
            </GlassCard>
          ))}
        </div>

        <PremiumInput
          label="Diamonds to Withdraw"
          placeholder={`Minimum ${minWithdrawDiamonds}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          icon={<Diamond size={18} />}
          className="mb-2"
        />
        {numAmount > 0 && (
          <p style={{
            color: numAmount > diamondBalance ? colors.danger : numAmount < minWithdrawDiamonds ? colors.danger : colors.primary,
            fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '16px',
          }}>
            {numAmount > diamondBalance
              ? `Insufficient diamonds (have ${diamondBalance})`
              : numAmount < minWithdrawDiamonds
              ? `Minimum ${minWithdrawDiamonds} diamonds required`
              : `You'll receive ₹${rupeesValue.toLocaleString()} (at ₹${DIAMOND_TO_RUPEE}/diamond)`}
          </p>
        )}

        <PremiumInput
          label="Bank Account / UPI"
          placeholder="Enter UPI ID or bank details"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          icon={<Building2 size={18} />}
          className="mb-6"
        />

        <GlassCard className="mb-6 flex items-start gap-3 p-4">
          <AlertCircle size={18} style={{ color: colors.primary, flexShrink: 0, marginTop: '2px' }} />
          <div style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', lineHeight: '1.6' }}>
            <p>Minimum withdrawal: <strong style={{ color: colors.primary }}>{minWithdrawDiamonds} diamonds</strong> {isPremium && <span style={{ color: colors.success }}>(Premium benefit)</span>}</p>
            <p>Rate: <strong style={{ color: colors.primary }}>1 diamond = ₹{DIAMOND_TO_RUPEE}</strong></p>
            <p>Requests are sent to your Creator Admin for <strong style={{ color: colors.primary }}>manual approval</strong>.</p>
            <p>Processing time: 24-48 hours after approval.</p>
          </div>
        </GlassCard>

        <PremiumButton fullWidth onClick={handleSubmit} disabled={!isValid} loading={processing}>
          <span className="flex items-center justify-center gap-2">Submit Withdrawal <ArrowRight size={18} /></span>
        </PremiumButton>
      </div>
    </ScreenWrapper>
  );
}