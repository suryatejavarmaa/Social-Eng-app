import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Coins, Diamond } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { AUDIO_COINS_PER_10SEC, VIDEO_COINS_PER_10SEC, COIN_DIAMOND_RATE } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function InCallScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { coinBalance, deductCoins, addDiamonds, addCallRecord, celebrities } = useApp();
  const user = resolveProfile(id, celebrities);
  const isVideo = type === 'video';
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [totalCoinsDeducted, setTotalCoinsDeducted] = useState(0);

  // Coin rate per 10 seconds
  const coinsPer10Sec = isVideo ? VIDEO_COINS_PER_10SEC : AUDIO_COINS_PER_10SEC;

  const lastDeductRef = useRef(0); // Last 10-sec interval deducted
  const timeRef = useRef(0);
  const totalCoinsRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Calculate diamonds: coins_spent ÷ 6
  const diamondsEarned = Math.floor(totalCoinsDeducted / COIN_DIAMOND_RATE);

  const handleEndCall = useCallback(() => {
    const finalCoins = totalCoinsRef.current;
    const finalDiamonds = Math.floor(finalCoins / COIN_DIAMOND_RATE);

    addCallRecord({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      type: isVideo ? 'video' : 'audio',
      duration: timeRef.current,
      coinsUsed: finalCoins,
      diamondsEarned: finalDiamonds,
      rating: undefined,
    });
    if (finalDiamonds > 0) {
      addDiamonds(finalDiamonds, user.name, isVideo ? 'video' : 'audio');
    }
    navigate(`/call-end/${id}`);
  }, [user, isVideo, navigate, id, addCallRecord, addDiamonds]);

  const handleEndCallRef = useRef(handleEndCall);
  handleEndCallRef.current = handleEndCall;

  // Timer + deduct coins every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((p) => {
        const newTime = p + 1;
        timeRef.current = newTime;
        return newTime;
      });

      // Deduct every 10 seconds
      const current10SecInterval = Math.floor(timeRef.current / 10);
      if (current10SecInterval > lastDeductRef.current && isMountedRef.current) {
        deductCoins(coinsPer10Sec, 'Call', user.name);
        totalCoinsRef.current += coinsPer10Sec;
        setTotalCoinsDeducted(totalCoinsRef.current);
        lastDeductRef.current = current10SecInterval;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [coinsPer10Sec, deductCoins, user.name]);

  // Auto-end if balance runs out
  useEffect(() => {
    if (coinBalance < coinsPer10Sec && time > 5 && isMountedRef.current) {
      handleEndCallRef.current();
    }
  }, [coinBalance, time, coinsPer10Sec]);

  // Per-minute summary
  const coinsPerMin = isVideo ? 24 : 6;
  const estMinsRemaining = Math.floor(coinBalance / coinsPerMin);

  return (
    <ScreenWrapper noPadding className="flex h-screen flex-col overflow-hidden select-none">
      {isVideo ? (
        <div className="relative flex flex-1 flex-col select-none" style={{ minHeight: '100vh' }}>
          <ImageWithFallback
            src={user.avatar}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: videoOff ? 'blur(20px)' : 'none', transition: 'filter 0.5s ease' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Self-view pip */}
          <div className="absolute right-4 top-20 h-36 w-24 overflow-hidden rounded-2xl" style={{ border: `2px solid ${colors.primary}`, background: colors.bg, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
            <div className="flex h-full items-center justify-center" style={{ background: colors.cardBg }}>
              <span style={{ color: colors.textSecondary, fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>You</span>
            </div>
          </div>

          {/* Live coin/diamond ticker */}
          <div className="absolute left-4 top-20 flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <Coins size={14} style={{ color: colors.primary }} />
              <span style={{ color: '#fff', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                -{totalCoinsDeducted} coins
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <Diamond size={14} style={{ color: colors.success }} />
              <span style={{ color: colors.success, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
                +{diamondsEarned} diamonds
              </span>
            </div>
            {coinBalance < coinsPerMin * 3 && (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 imitr-badge-pulse"
                style={{ background: `${colors.danger}90`, backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#fff', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                  Low balance! ~{estMinsRemaining}m left
                </span>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-6"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6) 30%)' }}>
            <div className="mb-2 text-center">
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                {isVideo ? '4' : '1'} coin per 10 sec • Receiver earns {isVideo ? '4' : '1'} diamond/min
              </span>
            </div>
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="imitr-counter" style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '28px' }}>
                {formatTime(time)}
              </span>
              <div className="rounded-full px-3 py-1" style={{ background: `${colors.primary}20`, backdropFilter: 'blur(8px)' }}>
                <span style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  {totalCoinsDeducted} coins
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => setMuted(!muted)}
                className="imitr-ripple flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: muted ? colors.danger : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', transition: 'all 0.3s ease' }}
              >
                {muted ? <MicOff size={20} style={{ color: '#fff' }} /> : <Mic size={20} style={{ color: colors.primary }} />}
              </button>
              <button
                onClick={() => setVideoOff(!videoOff)}
                className="imitr-ripple flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: videoOff ? colors.danger : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', transition: 'all 0.3s ease' }}
              >
                {videoOff ? <VideoOff size={20} style={{ color: '#fff' }} /> : <Video size={20} style={{ color: colors.primary }} />}
              </button>
              <button
                className="imitr-ripple flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <Volume2 size={20} style={{ color: colors.primary }} />
              </button>
              <button
                onClick={handleEndCall}
                className="imitr-ripple flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: 'linear-gradient(135deg, #FF4D4D, #CC0000)', boxShadow: '0 4px 20px rgba(255,77,77,0.4)' }}
              >
                <PhoneOff size={22} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Audio call */
        <div className="flex flex-1 flex-col items-center justify-center select-none" style={{ minHeight: '100vh' }}>
          <ImageWithFallback
            src={user.avatar}
            alt={user.name}
            className="mb-6 h-32 w-32 rounded-full object-cover"
            style={{ border: `3px solid ${colors.primary}`, boxShadow: `0 0 40px ${colors.glowColor}` }}
          />
          <h2 className="select-none" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
            {user.name}
          </h2>
          
          <p className="mt-1" style={{ color: colors.textSecondary, fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
            1 coin per 10 sec • Receiver earns 1 diamond/min
          </p>

          {coinBalance < coinsPerMin * 3 && (
            <p className="mt-2 imitr-badge-pulse" style={{ color: colors.danger, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              Low coin balance! ~{estMinsRemaining}m left
            </p>
          )}

          {/* Timer & live stats */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="imitr-counter" style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '28px' }}>
              {formatTime(time)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-full px-3 py-1" style={{ background: `${colors.primary}20`, backdropFilter: 'blur(8px)' }}>
              <span className="flex items-center gap-1" style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                <Coins size={12} /> -{totalCoinsDeducted}
              </span>
            </div>
            <div className="rounded-full px-3 py-1" style={{ background: `${colors.success}20`, backdropFilter: 'blur(8px)' }}>
              <span className="flex items-center gap-1" style={{ color: colors.success, fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                <Diamond size={12} /> +{diamondsEarned}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={() => setMuted(!muted)}
              className="imitr-ripple flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: muted ? colors.danger : `${colors.primary}20`, transition: 'all 0.3s ease' }}
            >
              {muted ? <MicOff size={20} style={{ color: '#fff' }} /> : <Mic size={20} style={{ color: colors.primary }} />}
            </button>
            <button
              className="imitr-ripple flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: `${colors.primary}20` }}
            >
              <Volume2 size={20} style={{ color: colors.primary }} />
            </button>
            <button
              onClick={handleEndCall}
              className="imitr-ripple flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #FF4D4D, #CC0000)', boxShadow: '0 4px 20px rgba(255,77,77,0.4)' }}
            >
              <PhoneOff size={22} style={{ color: '#fff' }} />
            </button>
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
}