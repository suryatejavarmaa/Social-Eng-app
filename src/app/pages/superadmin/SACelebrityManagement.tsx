import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useApp, CelebrityData } from '../../context/AppContext';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { StatCard } from '../../components/imitr/StatCard';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import {
  Crown, Star, Plus, Search, X, BadgeCheck, Users, Phone,
  Coins, Ban, Check, Trash2, Eye, Edit, Tag, Image as ImageIcon,
  Sparkles, TrendingUp, ToggleRight, ToggleLeft, ChevronDown,
  Filter, Activity, Globe, Radio, Hash, FileText, Copy, Shield,
} from 'lucide-react';

const CELEB_CATEGORIES = [
  'Actor', 'Actress', 'Singer', 'Musician', 'Model',
  'Influencer', 'Comedian', 'Athlete', 'Creator', 'Other',
];

const TAG_OPTIONS = [
  'Music', 'Fashion', 'Lifestyle', 'Comedy', 'Dance',
  'Gaming', 'Fitness', 'Beauty', 'Travel', 'Food',
  'Tech', 'Art', 'Sports', 'Education', 'Vlog',
];

export function SACelebrityManagement() {
  const { colors } = useTheme();
  const { celebrities, addCelebrity, removeCelebrity, toggleCelebStatus } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [createdCeleb, setCreatedCeleb] = useState<CelebrityData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    category: '',
    image: '',
    followers: '',
    rating: '4.5',
    coinRate: '10',
    bio: '',
    tags: [] as string[],
    isVerified: true,
  });

  const resetForm = () => {
    setForm({ name: '', phone: '', category: '', image: '', followers: '', rating: '4.5', coinRate: '10', bio: '', tags: [], isVerified: true });
  };

  const handleCreate = () => {
    if (!form.name || !form.category || !form.phone) return;
    const newCeleb = addCelebrity({
      name: form.name,
      phone: form.phone,
      category: form.category,
      image: form.image || 'https://images.unsplash.com/photo-1638964327749-53436bcccdca?w=400',
      followers: form.followers || '0',
      rating: parseFloat(form.rating) || 4.5,
      coinRate: parseInt(form.coinRate) || 10,
      isVerified: form.isVerified,
      isOnline: false,
      isLive: false,
      tags: form.tags,
      bio: form.bio,
      status: 'active',
    });
    resetForm();
    setShowCreateModal(false);
    setCreatedCeleb(newCeleb);
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const filtered = celebrities
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
    .filter(c => filterStatus === 'all' || c.status === filterStatus);

  const activeCelebs = celebrities.filter(c => c.status === 'active').length;
  const totalFollowers = celebrities.reduce((sum, c) => {
    const num = parseFloat(c.followers.replace(/[KM]/g, ''));
    const mult = c.followers.includes('M') ? 1000000 : c.followers.includes('K') ? 1000 : 1;
    return sum + num * mult;
  }, 0);
  const totalEarnings = celebrities.reduce((sum, c) => sum + c.totalEarnings, 0);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>
            Celebrity Management
          </h3>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '2px' }}>
            Create and manage celebrity accounts for the Celeb Lounge
          </p>
        </div>
        <PremiumButton size="sm" onClick={() => setShowCreateModal(true)}>
          <span className="flex items-center gap-1.5"><Plus size={15} /> Add Celebrity</span>
        </PremiumButton>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Crown size={18} />} label="Total Celebrities" value={celebrities.length.toString()} />
        <StatCard icon={<Activity size={18} />} label="Active" value={activeCelebs.toString()} />
        <StatCard icon={<Users size={18} />} label="Total Followers" value={formatNumber(totalFollowers)} />
        <StatCard icon={<Coins size={18} />} label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} />
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <PremiumInput
            placeholder="Search celebrities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'suspended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="rounded-xl px-3 py-2"
              style={{
                background: filterStatus === status ? `${colors.primary}25` : colors.cardBg,
                border: `1px solid ${filterStatus === status ? colors.primary : colors.cardBorder}`,
                color: filterStatus === status ? colors.primary : colors.text,
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif",
                textTransform: 'capitalize',
                transition: 'all 0.3s ease',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Celebrity list */}
      {filtered.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-10">
          <Crown size={40} style={{ color: colors.primary, opacity: 0.3, marginBottom: '12px' }} />
          <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
            No celebrities found
          </span>
          <PremiumButton size="sm" onClick={() => setShowCreateModal(true)} className="mt-4">
            <span className="flex items-center gap-1"><Plus size={14} /> Create First Celebrity</span>
          </PremiumButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((celeb, i) => (
            <motion.div
              key={celeb.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard className="overflow-hidden">
                {/* Main row */}
                <div className="flex items-center gap-3 p-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={celeb.image}
                      alt={celeb.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    {celeb.isOnline && (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full"
                        style={{
                          background: colors.success,
                          border: `2px solid ${colors.cardBg}`,
                          boxShadow: `0 0 6px ${colors.success}`,
                        }}
                      />
                    )}
                    {celeb.isLive && (
                      <div
                        className="absolute -top-1 -right-1 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
                        style={{ background: colors.danger, boxShadow: `0 0 8px ${colors.danger}50` }}
                      >
                        <Radio size={8} style={{ color: '#fff' }} />
                        <span style={{ color: '#fff', fontSize: '7px', fontFamily: "'Inter', sans-serif" }}>LIVE</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate" style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                        {celeb.name}
                      </span>
                      {celeb.isVerified && <BadgeCheck size={14} style={{ color: colors.primary, flexShrink: 0 }} />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        {celeb.category}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px' }}>·</span>
                      <span className="flex items-center gap-0.5" style={{ color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        <Star size={10} fill={colors.primary} /> {celeb.rating}
                      </span>
                      <span style={{ color: colors.textSecondary, fontSize: '11px' }}>·</span>
                      <span className="flex items-center gap-0.5" style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        <Users size={10} /> {celeb.followers}
                      </span>
                    </div>
                  </div>

                  {/* Status + expand */}
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5"
                      style={{
                        background: celeb.status === 'active' ? `${colors.success}20` : `${colors.danger}20`,
                        color: celeb.status === 'active' ? colors.success : colors.danger,
                        fontSize: '10px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {celeb.status}
                    </span>
                    <button
                      onClick={() => setExpandedId(expandedId === celeb.id ? null : celeb.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: `${colors.primary}08`, transition: 'all 0.3s ease' }}
                    >
                      <motion.div
                        animate={{ rotate: expandedId === celeb.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} style={{ color: colors.primary }} />
                      </motion.div>
                    </button>
                  </div>
                </div>

                {/* Expanded section */}
                <AnimatePresence>
                  {expandedId === celeb.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                        {/* Stats grid */}
                        <div className="mb-3 mt-3 grid grid-cols-3 gap-2">
                          <div className="rounded-lg p-2.5 text-center" style={{ background: `${colors.primary}08` }}>
                            <span style={{ color: colors.text, fontSize: '15px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                              {celeb.totalCalls.toLocaleString()}
                            </span>
                            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Calls</span>
                          </div>
                          <div className="rounded-lg p-2.5 text-center" style={{ background: `${colors.primary}08` }}>
                            <span style={{ color: colors.text, fontSize: '15px', fontFamily: "'Inter', sans-serif", display: 'block' }}>
                              ₹{celeb.totalEarnings.toLocaleString()}
                            </span>
                            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Earnings</span>
                          </div>
                          <div className="rounded-lg p-2.5 text-center" style={{ background: `${colors.primary}08` }}>
                            <span className="flex items-center justify-center gap-1" style={{ color: colors.primary, fontSize: '15px', fontFamily: "'Inter', sans-serif" }}>
                              <Coins size={12} /> {celeb.coinRate}
                            </span>
                            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>Coin Rate</span>
                          </div>
                        </div>

                        {/* Bio */}
                        {celeb.bio && (
                          <p className="mb-3 rounded-xl px-3 py-2" style={{ background: `${colors.primary}05`, color: colors.textSecondary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                            {celeb.bio}
                          </p>
                        )}

                        {/* Tags */}
                        {celeb.tags.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {celeb.tags.map(tag => (
                              <span key={tag} className="rounded-full px-2.5 py-0.5" style={{
                                background: `${colors.primary}12`,
                                color: colors.primary,
                                fontSize: '10px',
                                fontFamily: "'Inter', sans-serif",
                                border: `1px solid ${colors.primary}20`,
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Profile Info */}
                        <div className="mb-3 space-y-2">
                          {[
                            { label: 'Celebrity ID', value: celeb.id },
                            { label: 'Category', value: celeb.category },
                            { label: 'Followers', value: celeb.followers },
                            { label: 'Coin Rate', value: `${celeb.coinRate} coins/min` },
                            { label: 'Created', value: celeb.createdAt },
                          ].map(item => (
                            <div key={item.label} className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                              <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                              <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Login Info */}
                        <div className="mb-3 space-y-2">
                          <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Phone</span>
                            <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{celeb.phone}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                            <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Profile Status</span>
                            <span className="rounded-full px-2 py-0.5" style={{
                              background: celeb.profileCompleted ? `${colors.success}20` : `#F59E0B20`,
                              color: celeb.profileCompleted ? colors.success : '#F59E0B',
                              fontSize: '10px', fontFamily: "'Inter', sans-serif",
                            }}>
                              {celeb.profileCompleted ? 'Completed' : 'Pending Setup'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <PremiumButton
                            fullWidth
                            size="sm"
                            variant={celeb.status === 'active' ? 'danger' : 'primary'}
                            onClick={() => toggleCelebStatus(celeb.id)}
                          >
                            <span className="flex items-center justify-center gap-1">
                              {celeb.status === 'active' ? <><Ban size={14} /> Suspend</> : <><Check size={14} /> Activate</>}
                            </span>
                          </PremiumButton>
                          <PremiumButton size="sm" variant="danger" onClick={() => setDeleteConfirmId(celeb.id)}>
                            <span className="flex items-center justify-center gap-1"><Trash2 size={14} /></span>
                          </PremiumButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Create Celebrity Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-end justify-center sm:items-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl"
              style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, maxHeight: '90vh' }}
            >
              {/* Modal header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
                style={{ background: colors.cardBg, borderBottom: `1px solid ${colors.cardBorder}` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: colors.buttonGradient }}
                  >
                    <Crown size={18} style={{ color: colors.buttonText }} />
                  </div>
                  <div>
                    <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '18px' }}>
                      Create Celebrity
                    </h3>
                    <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                      Add a new celebrity to the platform
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { resetForm(); setShowCreateModal(false); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: `${colors.textSecondary}15` }}
                >
                  <X size={18} style={{ color: colors.textSecondary }} />
                </button>
              </div>

              {/* Modal body — scrollable */}
              <div className="overflow-y-auto p-6 imitr-scroll" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                <div className="flex flex-col gap-4">
                  {/* Image preview + URL */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                      <ImageIcon size={14} /> Profile Image
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                        style={{ background: `${colors.primary}10`, border: `1px dashed ${colors.primary}30` }}
                      >
                        {form.image ? (
                          <ImageWithFallback src={form.image} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Crown size={24} style={{ color: colors.primary, opacity: 0.3 }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <PremiumInput
                          placeholder="https://... or paste image URL"
                          value={form.image}
                          onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <PremiumInput
                    label="Celebrity Name *"
                    placeholder="Full display name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    icon={<Star size={18} />}
                  />

                  {/* Phone */}
                  <PremiumInput
                    label="Phone Number *"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    icon={<Phone size={18} />}
                  />

                  {/* Category */}
                  <div>
                    <label className="mb-2 block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CELEB_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                          className="rounded-xl px-3 py-2"
                          style={{
                            background: form.category === cat ? `${colors.primary}25` : `${colors.primary}06`,
                            border: `1px solid ${form.category === cat ? colors.primary : colors.cardBorder}`,
                            color: form.category === cat ? colors.primary : colors.text,
                            fontSize: '12px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Followers + Rating + Coin Rate */}
                  <div className="grid grid-cols-3 gap-3">
                    <PremiumInput
                      label="Followers"
                      placeholder="e.g. 1.2M"
                      value={form.followers}
                      onChange={(e) => setForm(prev => ({ ...prev, followers: e.target.value }))}
                      icon={<Users size={16} />}
                    />
                    <PremiumInput
                      label="Rating"
                      placeholder="4.5"
                      value={form.rating}
                      onChange={(e) => setForm(prev => ({ ...prev, rating: e.target.value }))}
                      icon={<Star size={16} />}
                    />
                    <PremiumInput
                      label="Coin Rate"
                      placeholder="10"
                      value={form.coinRate}
                      onChange={(e) => setForm(prev => ({ ...prev, coinRate: e.target.value }))}
                      icon={<Coins size={16} />}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                      <Tag size={14} /> Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map(tag => {
                        const isSelected = form.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="rounded-full px-3 py-1.5"
                            style={{
                              background: isSelected ? `${colors.primary}20` : `${colors.primary}06`,
                              border: `1px solid ${isSelected ? colors.primary : colors.cardBorder}`,
                              color: isSelected ? colors.primary : colors.textSecondary,
                              fontSize: '11px',
                              fontFamily: "'Inter', sans-serif",
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {isSelected && <Check size={10} className="mr-1 inline" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                      <FileText size={14} /> Bio
                    </label>
                    <textarea
                      placeholder="Short celebrity bio..."
                      value={form.bio}
                      onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full rounded-2xl px-4 py-3 outline-none"
                      style={{
                        background: colors.inputBg,
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        resize: 'none',
                      }}
                    />
                  </div>

                  {/* Verified toggle */}
                  <div
                    className="flex items-center justify-between rounded-2xl px-4 py-3"
                    style={{ background: `${colors.primary}06`, border: `1px solid ${colors.cardBorder}` }}
                  >
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={16} style={{ color: colors.primary }} />
                      <span style={{ color: colors.text, fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                        Verified Badge
                      </span>
                    </div>
                    <button onClick={() => setForm(prev => ({ ...prev, isVerified: !prev.isVerified }))}>
                      {form.isVerified ? (
                        <ToggleRight size={28} style={{ color: colors.primary }} />
                      ) : (
                        <ToggleLeft size={28} style={{ color: colors.inactive }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div
                className="sticky bottom-0 flex gap-3 px-6 py-4"
                style={{ background: colors.cardBg, borderTop: `1px solid ${colors.cardBorder}` }}
              >
                <button
                  onClick={() => { resetForm(); setShowCreateModal(false); }}
                  className="flex-1 rounded-2xl py-3"
                  style={{
                    background: `${colors.textSecondary}10`,
                    border: `1px solid ${colors.cardBorder}`,
                    color: colors.textSecondary,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.name || !form.category || !form.phone}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3"
                  style={{
                    background: form.name && form.category && form.phone ? colors.buttonGradient : `${colors.textSecondary}20`,
                    color: form.name && form.category && form.phone ? colors.buttonText : colors.textSecondary,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    boxShadow: form.name && form.category && form.phone ? `0 4px 20px ${colors.glowColor}` : 'none',
                    opacity: form.name && form.category && form.phone ? 1 : 0.5,
                    cursor: form.name && form.category && form.phone ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Sparkles size={16} />
                  Create Celebrity
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Created Celebrity Notification ─── */}
      <AnimatePresence>
        {createdCeleb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setCreatedCeleb(null); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl"
              style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Success Header */}
              <div className="px-6 pt-6 pb-4 text-center" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                <div
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: `${colors.success}15`, boxShadow: `0 0 30px ${colors.success}30` }}
                >
                  <Check size={32} style={{ color: colors.success }} />
                </div>
                <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '4px' }}>
                  Celebrity Created!
                </h3>
                <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  Account for <strong style={{ color: colors.primary }}>{createdCeleb.name}</strong> is now active on the platform
                </p>
              </div>

              {/* Celebrity Info */}
              <div className="px-6 py-4">
                <div className="mb-4 flex items-center gap-3 rounded-2xl p-3" style={{ background: `${colors.primary}06`, border: `1px solid ${colors.primary}15` }}>
                  <ImageWithFallback src={createdCeleb.image} alt={createdCeleb.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{createdCeleb.name}</span>
                      {createdCeleb.isVerified && <BadgeCheck size={14} style={{ color: colors.primary }} />}
                    </div>
                    <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                      {createdCeleb.category} · ID: {createdCeleb.id}
                    </span>
                  </div>
                </div>

                {/* Phone-based login info */}
                <div className="mb-4 rounded-2xl p-3" style={{ background: `${colors.success}06`, border: `1px solid ${colors.success}15` }}>
                  <div className="mb-2 flex items-center gap-2">
                    <Phone size={14} style={{ color: colors.success }} />
                    <span style={{ color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>Login Information</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded-xl border-0 px-3 py-2" style={{ background: `${colors.primary}04` }}>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>Phone</span>
                      <span style={{ color: colors.text, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{createdCeleb.phone}</span>
                    </div>
                    <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif", display: 'block', marginTop: '6px' }}>
                      Celebrity can login via the Celebrity Portal using this phone number. An OTP will be sent for verification.
                    </span>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={() => setCreatedCeleb(null)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5"
                  style={{ background: colors.buttonGradient, color: colors.buttonText, fontFamily: "'Inter', sans-serif", fontSize: '14px', boxShadow: `0 4px 20px ${colors.glowColor}` }}
                >
                  <Sparkles size={16} /> Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Copied Field Notification ─── */}
      <AnimatePresence>
        {copiedField && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}30`, color: colors.primary }}
          >
            <Copy size={16} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
              {copiedField} copied to clipboard!
            </span>
            <button
              onClick={() => setCopiedField(null)}
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: `${colors.primary}20` }}
            >
              <X size={12} style={{ color: colors.primary }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteConfirmId && (() => {
          const celebToDelete = celebrities.find(c => c.id === deleteConfirmId);
          if (!celebToDelete) return null;
          return (
            <motion.div
              key="delete-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] flex items-center justify-center px-4 py-6"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirmId(null); }}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl"
                style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
              >
                <div className="p-6 text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: `${colors.danger}15`, boxShadow: `0 0 30px ${colors.danger}20` }}
                  >
                    <Trash2 size={28} style={{ color: colors.danger }} />
                  </div>

                  <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px' }}>
                    Delete Celebrity?
                  </h3>
                  <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '16px' }}>
                    This will permanently remove <strong style={{ color: colors.danger }}>{celebToDelete.name}</strong> from the platform. This action cannot be undone.
                  </p>

                  <div
                    className="mb-5 flex items-center gap-3 rounded-2xl p-3 text-left"
                    style={{ background: `${colors.danger}06`, border: `1px solid ${colors.danger}15` }}
                  >
                    <ImageWithFallback src={celebToDelete.image} alt={celebToDelete.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate" style={{ color: colors.text, fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
                          {celebToDelete.name}
                        </span>
                        {celebToDelete.isVerified && <BadgeCheck size={14} style={{ color: colors.primary }} />}
                      </div>
                      <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                        {celebToDelete.category} · {celebToDelete.followers} followers · {celebToDelete.totalCalls.toLocaleString()} calls
                      </span>
                    </div>
                  </div>

                  <div
                    className="mb-5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-left"
                    style={{ background: `${colors.danger}08`, border: `1px solid ${colors.danger}15` }}
                  >
                    <Shield size={14} style={{ color: colors.danger, flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ color: colors.danger, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                      All account data, call history, and earnings records will be permanently deleted.
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 rounded-2xl py-3"
                      style={{
                        background: `${colors.textSecondary}10`,
                        border: `1px solid ${colors.cardBorder}`,
                        color: colors.textSecondary,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '14px',
                      }}
                    >
                      Cancel
                    </button>
                    <PremiumButton
                      fullWidth
                      variant="danger"
                      onClick={() => {
                        removeCelebrity(deleteConfirmId);
                        setDeleteConfirmId(null);
                        setExpandedId(null);
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Trash2 size={16} /> Delete Permanently
                      </span>
                    </PremiumButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}