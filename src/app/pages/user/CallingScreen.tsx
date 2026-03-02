import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Phone, PhoneOff } from 'lucide-react';
import { ScreenWrapper } from '../../components/imitr/ScreenWrapper';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { resolveProfile } from '../../data/resolveProfile';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function CallingScreen() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { celebrities } = useApp();
  const user = resolveProfile(id, celebrities);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    let mounted = true;
    const t1 = setTimeout(() => {
      if (mounted) setStatus('Ringing...');
    }, 1500);
    const t2 = setTimeout(() => {
      if (mounted) navigate(`/in-call/${id}/${type}`);
    }, 3500);
    return () => { 
      mounted = false;
      clearTimeout(t1); 
      clearTimeout(t2); 
    };
  }, [id, type, navigate]);

  return (
    <ScreenWrapper className="flex min-h-screen flex-col items-center justify-center select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8 rounded-full p-3"
          style={{ background: `${colors.primary}15` }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            className="rounded-full p-3"
            style={{ background: `${colors.primary}20` }}
          >
            <ImageWithFallback
              src={user.avatar}
              alt={user.name}
              className="h-28 w-28 rounded-full object-cover"
              style={{ border: `3px solid ${colors.primary}` }}
            />
          </motion.div>
        </motion.div>

        <h2 style={{ color: colors.text, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
          {user.name}
        </h2>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: '14px', marginTop: '8px' }}
        >
          {status}
        </motion.p>

        <button
          onClick={() => navigate(`/call-end/${id}`)}
          className="mt-16 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(135deg, #FF4D4D, #CC0000)', boxShadow: '0 4px 20px rgba(255,77,77,0.4)' }}
        >
          <PhoneOff size={24} style={{ color: '#fff' }} />
        </button>
      </motion.div>
    </ScreenWrapper>
  );
}