import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function IncomingCallScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { celebrities } = useApp();
  const user = resolveProfile(id, celebrities);
  const isVideo = type === 'video';

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Incoming {isVideo ? 'Video' : 'Audio'} Call
        </p>

        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6 rounded-full p-2"
          style={{ background: `${colors.primary}10` }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
            className="rounded-full p-2"
            style={{ background: `${colors.primary}15` }}
          >
            <ImageWithFallback
              src={user.avatar}
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover"
              style={{ border: `3px solid ${colors.primary}`, boxShadow: `0 0 40px ${colors.glowColor}` }}
            />
          </motion.div>
        </motion.div>

        <h1 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '26px' }}>{user.name}</h1>
        <p style={{ color: colors.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '4px' }}>{user.city}</p>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '13px', marginTop: '8px' }}
        >
          {isVideo ? <Video size={14} className="mr-1 inline" /> : <Phone size={14} className="mr-1 inline" />}
          {isVideo ? 'Earns 5 diamonds' : 'Earns 1 diamond'}
        </motion.p>

        <div className="mt-16 flex items-center gap-12">
          <button
            onClick={() => navigate('/home')}
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, #FF4D4D, #CC0000)', boxShadow: '0 4px 20px rgba(255,77,77,0.4)' }}
          >
            <PhoneOff size={24} style={{ color: '#fff' }} />
          </button>
          <motion.button
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            onClick={() => navigate(`/in-call/${id}/${type}`)}
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: `linear-gradient(135deg, ${colors.success}, #2E7D32)`, boxShadow: `0 4px 20px rgba(76,175,80,0.4)` }}
          >
            <Phone size={24} style={{ color: '#fff' }} />
          </motion.button>
        </div>
      </motion.div>
    </ScreenWrapper>
  );
}