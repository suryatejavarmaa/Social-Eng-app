import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Send, ChevronLeft, Coins, Diamond, AlertCircle, Info } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { GlassCard } from '../../components/imitr/GlassCard';
import { useTheme } from '../../context/ThemeContext';
import { useApp, MESSAGE_COST_COINS, MESSAGE_WORD_LIMIT, countWords } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function ChatScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { coinBalance, sendMessage, chatThreads, celebrities, userAssignedAdmin } = useApp();
  const user = resolveProfile(id, celebrities);
  const [text, setText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const thread = chatThreads.find(t => t.userId === user.id);
  const messages = thread?.messages || [];
  const wordCount = countWords(text);
  const canSend = text.trim().length > 0 && wordCount <= MESSAGE_WORD_LIMIT && coinBalance >= MESSAGE_COST_COINS;
  const isOverLimit = wordCount > MESSAGE_WORD_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!canSend) return;
    const success = sendMessage(user.id, user.name, user.avatar, text);
    if (success) {
      setText('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter keyboard: replace numbers with X visually
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Replace digits with X as user types
    const masked = val.replace(/\d/g, 'X');
    setText(masked);
  };

  const totalCoinsSent = thread?.totalCoinsSent || 0;
  const diamondsFromMessages = Math.floor(totalCoinsSent / 6);

  return (
    <ScreenWrapper noPadding>
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ 
          background: colors.navBg, 
          borderBottom: `1px solid ${colors.cardBorder}`,
          backdropFilter: 'blur(16px)',
        }}>
          <button
            onClick={() => navigate(-1)}
            className="imitr-ripple flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: `${colors.primary}15` }}
          >
            <ChevronLeft size={20} style={{ color: colors.primary }} />
          </button>
          <div className="flex flex-1 items-center gap-3" onClick={() => navigate(user.isCeleb ? `/celeb/${user.id}` : `/user/${user.id}`)}>
            <div className="relative">
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
                style={{ border: `2px solid ${colors.primary}` }}
              />
              {user.online && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full" 
                  style={{ background: colors.success, border: `2px solid ${colors.bg}` }} />
              )}
            </div>
            <div>
              <span style={{ color: colors.text, fontFamily: "'Inter', sans-serif", fontSize: '15px', display: 'block' }}>
                {user.name}
              </span>
              <span style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                {user.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="imitr-ripple flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: `${colors.primary}15` }}
          >
            <Info size={18} style={{ color: colors.primary }} />
          </button>
        </div>

        {/* Info banner */}
        {showInfo && (
          <div className="px-4 py-3" style={{ background: `${colors.primary}10`, borderBottom: `1px solid ${colors.cardBorder}` }}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2" style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                  <Coins size={14} /> {MESSAGE_COST_COINS} coins per message
                </span>
                <span className="flex items-center gap-2" style={{ color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                  <Diamond size={14} /> Receiver earns 1 diamond per 2 messages
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={12} style={{ color: colors.textSecondary }} />
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  Max {MESSAGE_WORD_LIMIT} words per message • Numbers are masked
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  Total spent: {totalCoinsSent} coins ({diamondsFromMessages} diamonds equivalent)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 imitr-scroll" style={{ paddingBottom: '100px' }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <GlassCard className="p-6 text-center" style={{ maxWidth: '280px' }}>
                <Diamond size={32} style={{ color: colors.primary, margin: '0 auto 12px' }} />
                <p style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '16px', marginBottom: '8px' }}>
                  Start Chatting
                </p>
                <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '12px', lineHeight: '1.6' }}>
                  Each message costs {MESSAGE_COST_COINS} coins. The receiver earns 1 diamond for every 2 messages you send.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 rounded-lg px-3 py-2" style={{ background: `${colors.primary}10` }}>
                  <Coins size={14} style={{ color: colors.primary }} />
                  <span style={{ color: colors.primary, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                    Your balance: {coinBalance.toLocaleString()} coins
                  </span>
                </div>
              </GlassCard>
            </div>
          )}

          {messages.map((msg) => {
            const isSent = msg.direction === 'sent';
            return (
              <div key={msg.id} className={`mb-3 flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isSent ? 'items-end' : 'items-start'}`}>
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{
                      background: isSent ? colors.buttonGradient : colors.cardBg,
                      border: isSent ? 'none' : `1px solid ${colors.cardBorder}`,
                      borderBottomRightRadius: isSent ? '6px' : '18px',
                      borderBottomLeftRadius: isSent ? '18px' : '6px',
                    }}
                  >
                    <p style={{
                      color: isSent ? colors.buttonText : colors.text,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                    }}>
                      {msg.text}
                    </p>
                  </div>
                  <div className={`mt-1 flex items-center gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                      {msg.timestamp.split(', ')[1] || msg.timestamp}
                    </span>
                    {isSent && (
                      <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                        <Coins size={10} /> -{msg.coinsSpent}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3" style={{ 
          background: colors.navBg,
          borderTop: `1px solid ${colors.cardBorder}`,
          backdropFilter: 'blur(16px)',
        }}>
          {/* Balance + word count bar */}
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1" style={{ color: colors.primary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
              <Coins size={12} /> {coinBalance.toLocaleString()} coins
            </span>
            <span style={{ 
              color: isOverLimit ? colors.danger : colors.textSecondary, 
              fontSize: '11px', 
              fontFamily: "'Inter', sans-serif" 
            }}>
              {wordCount}/{MESSAGE_WORD_LIMIT} words
            </span>
          </div>

          {coinBalance < MESSAGE_COST_COINS && (
            <div className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: `${colors.danger}15` }}>
              <AlertCircle size={14} style={{ color: colors.danger }} />
              <span style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                Insufficient coins! Need {MESSAGE_COST_COINS} coins per message.
              </span>
              <button 
                onClick={() => navigate(userAssignedAdmin ? '/recharge-coins' : '/admin-selection')}
                className="ml-auto rounded-lg px-3 py-1"
                style={{ background: colors.buttonGradient, color: colors.buttonText, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}
              >
                Recharge
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-2xl" style={{ 
              background: colors.inputBg, 
              border: `1px solid ${isOverLimit ? colors.danger : colors.cardBorder}`,
              transition: 'border-color 0.3s ease',
            }}>
              <textarea
                ref={inputRef}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 outline-none"
                style={{ 
                  color: colors.text, 
                  fontFamily: "'Inter', sans-serif", 
                  fontSize: '14px',
                  maxHeight: '100px',
                  minHeight: '44px',
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="imitr-ripple flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: canSend ? colors.buttonGradient : `${colors.primary}20`,
                opacity: canSend ? 1 : 0.5,
                boxShadow: canSend ? `0 4px 16px ${colors.glowColor}` : 'none',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              <Send size={18} style={{ color: canSend ? colors.buttonText : colors.textSecondary }} />
            </button>
          </div>

          <div className="mt-1.5 text-center">
            <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
              {MESSAGE_COST_COINS} coins per message • Numbers auto-masked
            </span>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}