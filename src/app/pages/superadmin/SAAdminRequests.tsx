import React, { useState } from 'react';
import {
  Shield, Clock, CheckCircle2, XCircle, Mail, AtSign, FileText,
  ChevronDown, ChevronUp, User, Phone, Briefcase, Palette, Megaphone,
  Users, Headphones, Eye, Search, Filter,
} from 'lucide-react';
import { GlassCard } from '../../components/imitr/GlassCard';
import { PremiumButton } from '../../components/imitr/PremiumButton';
import { PremiumInput } from '../../components/imitr/PremiumInput';
import { StatCard } from '../../components/imitr/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { useApp, AdminRequestData } from '../../context/AppContext';

const categoryIcons: Record<string, React.ElementType> = {
  'content-creator': Palette,
  'influencer': Megaphone,
  'business': Briefcase,
  'community': Users,
  'entertainer': Headphones,
};

const categoryLabels: Record<string, string> = {
  'content-creator': 'Content Creator',
  'influencer': 'Influencer',
  'business': 'Business Owner',
  'community': 'Community Manager',
  'entertainer': 'Entertainer',
};

export function SAAdminRequests() {
  const { colors } = useTheme();
  const { adminRequests, approveAdminRequestById, rejectAdminRequestById } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allRequests = adminRequests;

  const filtered = allRequests
    .filter(r => filterStatus === 'all' || r.status === filterStatus)
    .filter(r =>
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      (r.userName || '').toLowerCase().includes(search.toLowerCase())
    );

  const pendingCount = allRequests.filter(r => r.status === 'pending').length;
  const approvedCount = allRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = allRequests.filter(r => r.status === 'rejected').length;

  const statusColor = (s: string) =>
    s === 'pending' ? colors.primary :
    s === 'approved' ? colors.success : colors.danger;

  const statusBg = (s: string) =>
    s === 'pending' ? `${colors.primary}20` :
    s === 'approved' ? `${colors.success}20` : `${colors.danger}20`;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 style={{ color: colors.text, fontFamily: "'Playfair Display', serif" }}>
          Admin Requests ({allRequests.length})
        </h3>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Shield size={18} />} label="Total Requests" value={allRequests.length.toString()} />
        <StatCard icon={<Clock size={18} />} label="Pending" value={pendingCount.toString()} />
        <StatCard icon={<CheckCircle2 size={18} />} label="Approved" value={approvedCount.toString()} />
        <StatCard icon={<XCircle size={18} />} label="Rejected" value={rejectedCount.toString()} />
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <PremiumInput
            placeholder="Search by name, email or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-5 flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="rounded-xl px-4 py-2 transition-all"
            style={{
              background: filterStatus === status ? `${colors.primary}20` : `${colors.textSecondary}08`,
              border: `1px solid ${filterStatus === status ? colors.primary : colors.cardBorder}`,
              color: filterStatus === status ? colors.primary : colors.textSecondary,
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              textTransform: 'capitalize',
            }}
          >
            {status} {status === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <GlassCard className="p-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: `${colors.primary}10` }}
          >
            <Shield size={28} style={{ color: colors.primary, opacity: 0.5 }} />
          </div>
          <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
            No admin requests yet
          </p>
          <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', marginTop: '4px' }}>
            When users apply for Creator Admin access, their requests will appear here.
          </p>
        </GlassCard>
      )}

      {/* Request Cards */}
      {filtered.map((req) => {
        const CatIcon = categoryIcons[req.category] || Shield;
        const isExpanded = expandedId === req.id;
        const displayName = req.userName || req.email.split('@')[0] || 'Applicant';

        return (
          <GlassCard key={req.id} className="mb-3 overflow-hidden">
            {/* Header Row */}
            <button
              className="flex w-full items-center gap-4 p-4"
              onClick={() => setExpandedId(isExpanded ? null : req.id)}
            >
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: statusBg(req.status) }}
              >
                <CatIcon size={20} style={{ color: statusColor(req.status) }} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                    {displayName}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      background: statusBg(req.status),
                      color: statusColor(req.status),
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {req.status}
                  </span>
                </div>
                <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                  {categoryLabels[req.category] || req.category} &bull; {req.submittedAt}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {req.status === 'pending' && (
                  <div
                    className="h-2.5 w-2.5 animate-pulse rounded-full"
                    style={{ background: colors.primary, boxShadow: `0 0 8px ${colors.glowColor}` }}
                  />
                )}
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: colors.textSecondary }} />
                ) : (
                  <ChevronDown size={16} style={{ color: colors.textSecondary }} />
                )}
              </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div style={{ borderTop: `1px solid ${colors.cardBorder}` }}>
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3 p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <div className="flex items-center gap-2">
                    <Mail size={14} style={{ color: colors.primary }} />
                    <div>
                      <span className="block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>Email</span>
                      <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{req.email}</span>
                    </div>
                  </div>
                  {req.socialHandle && (
                    <div className="flex items-center gap-2">
                      <AtSign size={14} style={{ color: colors.primary }} />
                      <div>
                        <span className="block" style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>Social</span>
                        <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>{req.socialHandle}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pitch */}
                <div className="p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <FileText size={14} style={{ color: colors.primary }} />
                    <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Pitch
                    </span>
                  </div>
                  <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.6' }}>
                    {req.pitch}
                  </p>
                </div>

                {/* Reason */}
                {req.reason && (
                  <div className="p-4" style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Eye size={14} style={{ color: colors.primary }} />
                      <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Reason
                      </span>
                    </div>
                    <p style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '13px', lineHeight: '1.6' }}>
                      {req.reason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {req.status === 'pending' && (
                  <div className="flex gap-3 p-4">
                    <PremiumButton fullWidth size="sm" onClick={() => approveAdminRequestById(req.id)}>
                      <span className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={14} /> Approve
                      </span>
                    </PremiumButton>
                    <PremiumButton fullWidth size="sm" variant="danger" onClick={() => rejectAdminRequestById(req.id)}>
                      <span className="flex items-center justify-center gap-1.5">
                        <XCircle size={14} /> Reject
                      </span>
                    </PremiumButton>
                  </div>
                )}

                {/* Resolved Status */}
                {req.status !== 'pending' && (
                  <div className="flex items-center justify-center gap-2 p-4">
                    {req.status === 'approved' ? (
                      <CheckCircle2 size={16} style={{ color: colors.success }} />
                    ) : (
                      <XCircle size={16} style={{ color: colors.danger }} />
                    )}
                    <span style={{
                      color: req.status === 'approved' ? colors.success : colors.danger,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                    }}>
                      {req.status === 'approved' ? 'This request has been approved' : 'This request has been declined'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
