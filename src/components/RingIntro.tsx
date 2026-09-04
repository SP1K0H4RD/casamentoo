import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import WeddingRings from './WeddingRings';
import { Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface RingIntroProps {
  onAuthenticated: () => void;
}

export default function RingIntro({ onAuthenticated }: RingIntroProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'rings' | 'names' | 'password'>('rings');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  useEffect(() => {
    const timerNames = setTimeout(() => {
      setPhase('names');
    }, 2200);

    const timerPassword = setTimeout(() => {
      setPhase('password');
    }, 5500);

    return () => {
      clearTimeout(timerNames);
      clearTimeout(timerPassword);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPass = password.trim();
    if (!cleanPass) {
      setError('Por favor, digite a senha.');
      return;
    }

    // Check if guest password
    if (authService.validateGuestPassword(cleanPass)) {
      authService.setGuestAuthenticated(true);
      setIsUnlocking(true);
      
      setTimeout(() => {
        setIsExiting(true);
      }, 900);

      setTimeout(() => {
        onAuthenticated();
      }, 1600);
      return;
    }

    // If couple enters admin password directly
    if (authService.validateAdminPassword(cleanPass)) {
      authService.setAdminAuthenticated(true);
      authService.setGuestAuthenticated(true);
      setIsAdminUnlocked(true);
      setIsUnlocking(true);
      setTimeout(() => {
        setIsExiting(true);
      }, 800);
      setTimeout(() => {
        navigate('/admin');
      }, 1400);
      return;
    }

    setError('Senha incorreta. Verifique a senha no seu convite.');
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-wedding-cream px-4 overflow-hidden"
        >
          {/* Decorative Background Glow */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-wedding-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-wedding-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
            
            {/* REALISTIC 3D WEDDING RINGS */}
            <motion.div
              animate={isUnlocking ? { y: -90, scale: 0.9, opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="mb-2 z-20"
            >
              <WeddingRings size={160} />
            </motion.div>

            {/* NAMES (Date and Location removed per request) */}
            <AnimatePresence>
              {(phase === 'names' || phase === 'password') && !isUnlocking && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="mb-5"
                >
                  <p className="text-wedding-gold text-xs tracking-[0.25em] uppercase font-medium mb-1.5">
                    Celebração do Matrimônio
                  </p>
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-charcoal tracking-wide">
                    Matheus <span className="text-wedding-gold italic font-normal">&</span> Ângela
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PASSWORD CARD */}
            <AnimatePresence>
              {phase === 'password' && !isUnlocking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="w-full bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-wedding-gold/20"
                >
                  <div className="mb-5">
                    <p className="text-wedding-charcoal font-serif text-lg">Seja bem-vindo(a)</p>
                    <p className="text-wedding-warmgray text-xs mt-0.5">
                      Insira a senha que você recebeu no convite para acessar
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Digite sua senha..."
                        autoFocus
                        className="w-full pl-10 pr-4 py-3.5 bg-wedding-cream/40 border border-wedding-gold/30 rounded-xl text-center text-wedding-charcoal placeholder:text-wedding-warmgray/60 focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 transition-all font-sans text-base"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-wedding-gold/70" size={18} />
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs font-medium"
                      >
                        {error}
                      </motion.p>
                    )}

                    {isAdminUnlocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-2.5 bg-amber-50 text-amber-700 text-xs rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck size={16} className="text-amber-600" />
                        <span>Acesso de Administrador identificado! Redirecionando...</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-wedding-charcoal text-white rounded-xl font-medium tracking-wide hover:bg-wedding-charcoal-light active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>Entrar no Convite</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Initial loading hint if still in early phase */}
            {phase === 'rings' && !isUnlocking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-4 flex items-center gap-2 text-wedding-gold text-xs font-serif italic"
              >
                <Sparkles size={14} className="animate-spin-slow" />
                <span>Preparando uma ocasião inesquecível...</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
