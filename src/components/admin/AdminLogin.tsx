import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const isValid = authService.validateAdminPassword(password);
    if (isValid) {
      authService.setAdminAuthenticated(true);
      onLogin();
    } else {
      setError('Senha administrativa incorreta. Verifique suas credenciais.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-wedding-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-wedding-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-wedding-gold/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 md:p-10 w-full max-w-md shadow-xl border border-wedding-gold/20 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-tr from-wedding-gold/20 to-wedding-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-wedding-gold/30 shadow-inner"
          >
            <ShieldCheck className="text-wedding-gold" size={32} />
          </motion.div>
          <h1 className="font-serif text-2xl md:text-3xl text-wedding-charcoal">Painel dos Noivos</h1>
          <p className="text-wedding-warmgray text-sm mt-1.5">
            Acesso restrito para gestão de convidados, presentes e PIX
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-2">
              Senha de Administrador
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Digite a senha do painel..."
                autoFocus
                className="w-full pl-11 pr-12 py-3.5 bg-wedding-cream/30 border border-wedding-gold/30 rounded-xl text-wedding-charcoal placeholder:text-wedding-warmgray/50 focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 transition-all font-sans"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-wedding-gold/70" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-wedding-warmgray hover:text-wedding-charcoal transition-colors p-1"
                tabIndex={-1}
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!password.trim() || isSubmitting}
            className="w-full py-3.5 bg-wedding-charcoal text-white rounded-xl font-medium tracking-wide hover:bg-wedding-charcoal-light active:scale-[0.99] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Verificando...' : 'Acessar Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-wedding-gold/10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-wedding-warmgray hover:text-wedding-charcoal text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar para o convite do casamento
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
