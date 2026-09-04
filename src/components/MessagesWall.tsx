import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageService } from '../services/supabase';
import type { GuestMessage } from '../types';
import { MessageSquareHeart, Heart, Send, X, Plus, Sparkles, User } from 'lucide-react';

export default function MessagesWall() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const data = await messageService.getAll();
    setMessages(data);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSuccessNotice(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    await messageService.create({
      name: name.trim(),
      message: message.trim(),
    });

    await loadMessages();
    setIsSubmitting(false);
    setSuccessNotice(true);
    setTimeout(() => {
      handleCloseModal();
    }, 1200);
  };

  return (
    <section id="messages" className="py-24 md:py-32 bg-wedding-cream relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-wedding-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-wedding-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-wedding-gold text-xs tracking-[0.3em] uppercase font-medium">Mural dos Convidados</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-charcoal mt-2">
            Recados para o Casal
          </h2>
          <p className="text-wedding-warmgray text-sm mt-3 max-w-lg mx-auto">
            Deixe seus votos de felicidade e palavras de carinho para Matheus & Ângela. Todas as mensagens ficarão guardadas com amor!
          </p>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mt-6" />

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-wedding-charcoal text-white rounded-full font-medium text-sm hover:bg-wedding-charcoal-light active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <MessageSquareHeart size={18} className="text-wedding-gold" />
              <span>Deixar um Recado com Carinho</span>
              <Plus size={16} />
            </button>
          </div>
        </motion.div>

        {/* Public Messages Grid */}
        {messages.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-wedding-gold/20 shadow-md flex flex-col justify-between relative group hover:border-wedding-gold/40 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-wedding-gold/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-wedding-gold/15 flex items-center justify-center text-wedding-gold text-xs font-semibold">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-wedding-charcoal leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-wedding-warmgray">
                          {new Date(item.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <Heart size={15} className="text-wedding-gold/50 fill-wedding-gold/20 group-hover:scale-110 transition-transform" />
                  </div>

                  <p className="text-wedding-charcoal/90 text-sm leading-relaxed font-sans italic">
                    “{item.message}”
                  </p>
                </div>

                <div className="mt-4 pt-2 flex items-center gap-1.5 text-wedding-gold text-[11px] font-medium">
                  <Sparkles size={12} />
                  <span>Bênção aos Noivos</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-wedding-gold/20 max-w-lg mx-auto">
            <Heart size={32} className="text-wedding-gold mx-auto mb-3 opacity-60" />
            <p className="font-serif text-lg text-wedding-charcoal">Seja o primeiro a deixar um recado!</p>
            <p className="text-xs text-wedding-warmgray mt-1">
              Escreva seus votos e felicitações clicando no botão acima.
            </p>
          </div>
        )}
      </div>

      {/* MODAL / DIALOG TO WRITE A MESSAGE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-wedding-gold/25 shadow-2xl relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-wedding-warmgray hover:text-wedding-charcoal rounded-full hover:bg-wedding-cream transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-wedding-gold/15 flex items-center justify-center text-wedding-gold mx-auto mb-3">
                  <MessageSquareHeart size={24} />
                </div>
                <h3 className="font-serif text-2xl text-wedding-charcoal">Recado para os Noivos</h3>
                <p className="text-wedding-warmgray text-xs mt-1">
                  Sua mensagem será publicada no mural dos convidados
                </p>
              </div>

              {successNotice ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200"
                >
                  <Sparkles size={32} className="mx-auto text-emerald-600 mb-2" />
                  <p className="font-serif text-lg font-semibold">Mensagem enviada com sucesso!</p>
                  <p className="text-xs text-emerald-600 mt-1">Obrigado pelo seu carinho com Matheus e Ângela.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-1.5">
                      <User size={13} className="text-wedding-gold" />
                      Seu Nome / Família *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Tio Paulo e Família"
                      className="w-full px-4 py-3 bg-wedding-cream/30 border border-wedding-gold/30 rounded-xl text-wedding-charcoal placeholder:text-wedding-warmgray/50 focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-1.5">
                      Sua Mensagem de Carinho *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escreva seus votos, felicitações ou palavras de carinho para o casal..."
                      className="w-full px-4 py-3 bg-wedding-cream/30 border border-wedding-gold/30 rounded-xl text-wedding-charcoal placeholder:text-wedding-warmgray/50 focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !message.trim()}
                    className="w-full py-3.5 bg-wedding-charcoal text-white rounded-xl font-medium text-sm tracking-wide hover:bg-wedding-charcoal-light active:scale-[0.99] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    <span>{isSubmitting ? 'Publicando...' : 'Publicar Recado no Mural'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
