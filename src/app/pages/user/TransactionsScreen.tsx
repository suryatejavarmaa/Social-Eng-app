import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { BottomNav } from '../../components/imitr/BottomNav';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function TransactionsScreen() {
  const { colors } = useTheme();
  const { transactions } = useApp();
  const [filter, setFilter] = useState<'all' | 'recharge' | 'call'>('all');

  const filtered = transactions.filter((tx) => filter === 'all' || tx.type === filter);

  return (
    <ScreenWrapper noPadding>
      <div className="px-5 pb-24 pt-6 imitr-page-enter">
        <HeaderBar title="Transactions" showBack />
        <div className="mb-5 flex gap-3">
          {(['all', 'recharge', 'call'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="imitr-ripple rounded-xl px-4 py-2"
              style={{
                background: filter === f ? colors.buttonGradient : colors.cardBg,
                color: filter === f ? colors.buttonText : colors.text,
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                border: `1px solid ${filter === f ? 'transparent' : colors.cardBorder}`,
                transition: 'all 0.3s ease',
              }}
            >
              {f === 'all' ? 'All' : f === 'recharge' ? 'Recharges' : 'Calls'}
            </button>
          ))}
        </div>

        <div className="imitr-stagger flex flex-col gap-3">
          {filtered.map((tx) => (
            <GlassCard key={tx.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: tx.amount > 0 ? `${colors.success}20` : `${colors.primary}15` }}>
                  {tx.amount > 0 ? <ArrowDownLeft size={18} style={{ color: colors.success }} /> : <ArrowUpRight size={18} style={{ color: colors.primary }} />}
                </div>
                <div>
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                    {tx.type === 'recharge' ? `Recharge via ${tx.method}` : tx.type === 'call' ? `Call with ${tx.user}` : tx.type}
                  </span>
                  <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>{tx.date}</span>
                </div>
              </div>
              <div className="text-right">
                <span style={{ color: tx.amount > 0 ? colors.success : colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '14px', display: 'block' }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </span>
                <span className="rounded-full px-1.5 py-0.5" style={{
                  background: tx.status === 'completed' ? `${colors.success}15` : `${colors.primary}15`,
                  color: tx.status === 'completed' ? colors.success : colors.primary,
                  fontSize: '9px', fontFamily: "'Inter', sans-serif",
                }}>
                  {tx.status}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
}
