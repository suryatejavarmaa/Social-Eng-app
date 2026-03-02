import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Crown, Check, Users, ArrowRight, Shield, Coins, Search, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { HeaderBar } from '../../components/imitr/HeaderBar';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export function AdminSelectionScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { admins, userAssignedAdmin, assignAdminToUser } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState<'sending' | 'assigned'>('sending');
  const [assignedAdmin, setAssignedAdmin] = useState<{ id: string; name: string; organization?: string } | null>(null);

  // If user already has an assigned admin, redirect to recharge-coins directly
  useEffect(() => {
    if (userAssignedAdmin) {
      navigate('/recharge-coins', { replace: true });
    }
  }, [userAssignedAdmin, navigate]);

  const activeAdmins = admins.filter(a => a.status === 'active');
  const filtered = activeAdmins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.organization?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAdmin = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleSendRequest = () => {
    if (selectedIds.length === 0) return;
    setShowModal(true);
    setModalPhase('sending');

    // After 10 seconds, randomly pick one admin and assign
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * selectedIds.length);
      const chosenId = selectedIds[randomIndex];
      const chosenAdmin = admins.find(a => a.id === chosenId);
      if (chosenAdmin) {
        setAssignedAdmin({ id: chosenAdmin.id, name: chosenAdmin.name, organization: chosenAdmin.organization });
        assignAdminToUser(chosenAdmin.id);
      }
      setModalPhase('assigned');
    }, 10000);
  };

  const handleModalDone = () => {
    setShowModal(false);
    navigate('/wallet', { replace: true });
  };

  return (
    <ScreenWrapper>
      <div className="imitr-page-enter">
        <HeaderBar title="Select Admin" showBack />

        {/* Info Card */}
        <GlassCard className="mb-5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${colors.primary}15` }}>
              <Users size={18} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1">
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                Choose up to 3 Admins
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                Select admins to send your request. One will be assigned to you shortly, then you can recharge coins directly.
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Selected count */}
        <div className="mb-3 flex items-center justify-between">
          <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
            Active Admins ({activeAdmins.length})
          </span>
          <span style={{
            color: selectedIds.length >= 3 ? colors.danger : colors.primary,
            fontSize: '12px', fontFamily: "'Inter', sans-serif",
          }}>
            {selectedIds.length}/3 selected
          </span>
        </div>

        {/* Search */}
        <PremiumInput
          placeholder="Search admins..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          icon={<Search size={16} />}
          className="mb-4"
        />

        {/* Admin List */}
        <div className="imitr-stagger mb-6 space-y-3">
          {filtered.length === 0 && (
            <GlassCard className="flex flex-col items-center gap-3 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: `${colors.primary}12` }}>
                <Users size={24} style={{ color: colors.primary }} />
              </div>
              <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                {search ? 'No admins match your search' : 'No active admins available'}
              </span>
              <span style={{ color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif", textAlign: 'center' }}>
                {search ? 'Try a different search term.' : 'Please try again later or contact support.'}
              </span>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-1 rounded-lg px-4 py-1.5"
                  style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}
                >
                  Clear Search
                </button>
              )}
            </GlassCard>
          )}
          {filtered.map((admin, i) => {
            const isSelected = selectedIds.includes(admin.id);
            const isDisabled = !isSelected && selectedIds.length >= 3;
            return (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard
                  className="flex items-center gap-3 p-4"
                  onClick={() => !isDisabled && toggleAdmin(admin.id)}
                  style={{
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    border: isSelected ? `1.5px solid ${colors.primary}` : undefined,
                    boxShadow: isSelected ? `0 0 16px ${colors.glowColor}` : undefined,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isSelected ? colors.buttonGradient : `${colors.primary}10`,
                      border: isSelected ? 'none' : `1.5px solid ${colors.primary}30`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isSelected && <Check size={14} style={{ color: colors.buttonText }} />}
                  </div>

                  {/* Avatar */}
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                    <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                      {admin.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate" style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                        {admin.name}
                      </span>
                      <Shield size={12} style={{ color: colors.primary, flexShrink: 0 }} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {admin.organization && (
                        <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                          {admin.organization}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5" style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        <Users size={9} /> {admin.users}
                      </span>
                      <span className="flex items-center gap-0.5" style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        <Coins size={9} /> {(admin.coinInventory / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className="flex-shrink-0 rounded-full px-2 py-0.5" style={{
                    background: `${colors.success}20`, color: colors.success,
                    fontSize: '9px', fontFamily: "'Inter', sans-serif",
                  }}>
                    Active
                  </span>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Selected admins strip */}
        {selectedIds.length > 0 && (
          <GlassCard className="mb-4 p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Crown size={14} style={{ color: colors.primary }} />
              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Selected:</span>
              {selectedIds.map(id => {
                const a = admins.find(x => x.id === id);
                return a ? (
                  <span key={id} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{
                    background: `${colors.primary}12`, border: `1px solid ${colors.primary}20`,
                    color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif",
                  }}>
                    <Crown size={10} /> {a.name.split(' ')[0]}
                  </span>
                ) : null;
              })}
            </div>
          </GlassCard>
        )}

        <PremiumButton
          fullWidth
          disabled={selectedIds.length === 0}
          onClick={handleSendRequest}
        >
          <span className="flex items-center justify-center gap-2">
            Send Request <ArrowRight size={16} />
          </span>
        </PremiumButton>
      </div>

      {/* ─── Assignment Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm rounded-3xl p-6 relative overflow-hidden"
            style={{
              background: colors.cardBg,
              backdropFilter: 'blur(40px)',
              border: `1px solid ${colors.primary}30`,
              boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${colors.glowColor}`,
            }}
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-20" style={{ background: colors.buttonGradient, filter: 'blur(60px)' }} />

            {modalPhase === 'sending' ? (
              <div className="flex flex-col items-center gap-5 py-4 relative z-10">
                {/* Spinning loader */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: `${colors.primary}15`, border: `2px solid ${colors.primary}30` }}
                >
                  <Loader2 size={36} style={{ color: colors.primary }} />
                </motion.div>
                <div className="text-center">
                  <span style={{ color: colors.text, fontSize: '18px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    Request Sent!
                  </span>
                  <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '8px', lineHeight: '1.6' }}>
                    Your request has been sent to {selectedIds.length} admin{selectedIds.length > 1 ? 's' : ''}.
                    One of the selected admins will be assigned to you shortly. Please wait...
                  </span>
                </div>
                {/* Selected admin names */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {selectedIds.map(id => {
                    const a = admins.find(x => x.id === id);
                    return a ? (
                      <span key={id} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{
                        background: `${colors.primary}12`, border: `1px solid ${colors.primary}20`,
                        color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif",
                      }}>
                        <Crown size={10} /> {a.name.split(' ')[0]}
                      </span>
                    ) : null;
                  })}
                </div>
                {/* Pulsing dots */}
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      className="h-2 w-2 rounded-full"
                      style={{ background: colors.primary }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2 relative z-10">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: `${colors.success}15`, border: `2px solid ${colors.success}30` }}
                >
                  <CheckCircle size={40} style={{ color: colors.success }} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <span style={{ color: colors.text, fontSize: '18px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                    Admin Assigned!
                  </span>
                  <span style={{ color: colors.textSecondary, fontSize: '13px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '6px', lineHeight: '1.5' }}>
                    You've been assigned to an admin. You can now recharge coins directly from your Wallet!
                  </span>
                </motion.div>

                {/* Assigned admin card */}
                {assignedAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full"
                  >
                    <GlassCard className="flex items-center gap-3 p-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" style={{ background: colors.buttonGradient }}>
                        <span style={{ color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                          {assignedAdmin.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate" style={{ color: colors.text, fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
                            {assignedAdmin.name}
                          </span>
                          <Shield size={13} style={{ color: colors.primary }} />
                        </div>
                        {assignedAdmin.organization && (
                          <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                            {assignedAdmin.organization}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: `${colors.success}15` }}>
                        <Sparkles size={10} style={{ color: colors.success }} />
                        <span style={{ color: colors.success, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Your Admin</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="w-full pt-2"
                >
                  <PremiumButton fullWidth onClick={handleModalDone}>
                    <span className="flex items-center justify-center gap-2">
                      Go to Wallet <ArrowRight size={16} />
                    </span>
                  </PremiumButton>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </ScreenWrapper>
  );
}
