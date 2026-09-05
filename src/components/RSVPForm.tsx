import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rsvpService } from '../services/supabase';
import { Check, Users, User, Plus, Trash2, Heart } from 'lucide-react';

export default function RSVPForm() {
  const [guestName, setGuestName] = useState('');
  const [companions, setCompanions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddCompanion = () => {
    if (companions.length < 10) {
      setCompanions([...companions, '']);
    }
  };

  const handleRemoveCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const handleCompanionNameChange = (index: number, value: string) => {
    const updated = [...companions];
    updated[index] = value;
    setCompanions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setLoading(true);
    const validCompanions = companions.map(c => c.trim()).filter(Boolean);

    await rsvpService.create({
      guest_name: guestName.trim(),
      guests_count: 1 + validCompanions.length,
      companions: validCompanions,
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-wedding-gold text-xs tracking-[0.3em] uppercase font-medium">Confirmação</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-charcoal mt-2">
            Confirmar Presença
          </h2>
          <p className="text-wedding-warmgray text-sm mt-3">
            Sua presença será nossa maior alegria! Confirme para organizarmos tudo com amor e carinho.
          </p>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mt-6" />
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-wedding-cream rounded-3xl p-8 sm:p-10 text-center border border-wedding-gold/20 shadow-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
              >
                <Check className="text-emerald-600" size={38} />
              </motion.div>
              <h3 className="font-serif text-2xl text-wedding-charcoal font-semibold">Presença Confirmada!</h3>
              <p className="text-wedding-warmgray mt-3 text-sm leading-relaxed">
                Muito obrigado, <strong className="text-wedding-charcoal">{guestName}</strong>! Será uma imensa honra celebrar este dia inesquecível com você.
              </p>
              {companions.filter(Boolean).length > 0 && (
                <div className="mt-4 p-4 bg-white/70 rounded-2xl border border-wedding-gold/15 text-xs text-wedding-charcoal/80 text-left">
                  <p className="font-semibold text-wedding-gold mb-1 uppercase tracking-wider">Componentes da família confirmados:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {companions.filter(Boolean).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setGuestName('');
                    setCompanions([]);
                  }}
                  className="px-6 py-2.5 bg-wedding-charcoal text-white rounded-xl text-xs font-medium hover:bg-wedding-charcoal-light transition-colors"
                >
                  Enviar outra confirmação
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-wedding-cream rounded-3xl p-6 sm:p-8 space-y-6 border border-wedding-gold/20 shadow-md"
            >
              {/* Main Guest Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-2">
                  <User size={15} className="text-wedding-gold" />
                  Nome Completo *
                </label>
                <input
                  required
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Seu nome e sobrenome"
                  className="w-full px-4 py-3.5 bg-white border border-wedding-gold/25 rounded-xl focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 transition-all text-wedding-charcoal"
                />
              </div>

              {/* Companions Section */}
              <div className="pt-2 border-t border-wedding-gold/15">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70">
                    <Users size={15} className="text-wedding-gold" />
                    Componentes da família ({companions.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCompanion}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-wedding-gold/15 hover:bg-wedding-gold/25 text-wedding-gold-dark font-medium text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Adicionar Componente da Família</span>
                  </button>
                </div>

                {companions.length === 0 ? (
                  <p className="text-xs text-wedding-warmgray/80 italic bg-white/50 p-3 rounded-xl border border-dashed border-wedding-gold/20 text-center">
                    Vai acompanhado(a)? Clique no botão acima para informar os componentes da família que irão com você.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {companions.map((compName, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="relative flex-1">
                          <input
                            required
                            type="text"
                            value={compName}
                            onChange={(e) => handleCompanionNameChange(index, e.target.value)}
                            placeholder={`Nome completo do componente da família ${index + 1}`}
                            className="w-full px-4 py-3 bg-white border border-wedding-gold/25 rounded-xl focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 transition-all text-sm text-wedding-charcoal"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompanion(index)}
                          className="p-3 text-wedding-warmgray hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Remover componente da família"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !guestName.trim()}
                  className="w-full py-4 bg-wedding-charcoal text-white rounded-xl font-medium tracking-wide hover:bg-wedding-charcoal-light active:scale-[0.99] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart size={16} className="text-wedding-gold fill-wedding-gold" />
                  <span>{loading ? 'Confirmando...' : 'Confirmar Presença'}</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
