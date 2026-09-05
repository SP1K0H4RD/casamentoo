import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gift } from '../types';
import { paymentService } from '../services/supabase';
import { X, ExternalLink, Check, ShoppingBag, HeartHandshake } from 'lucide-react';

interface GiftModalProps {
  gift: Gift;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GiftModal({ gift, onClose, onSuccess }: GiftModalProps) {
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSoldOut = (gift.purchased_count ?? 0) >= (gift.max_quantity ?? 1);

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setLoading(true);
    try {
      await paymentService.create({
        guest_name: guestName.trim(),
        gift_id: gift.id,
        gift_name: gift.name,
        amount: gift.value,
        payment_method: 'store_link',
        status: 'confirmed',
      });
      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Erro ao registrar presente:', err);
      alert('Houve um erro ao registrar seu presente. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-wedding-gold/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            {/* CABEÇALHO */}
            <div className="flex items-center justify-between pb-4 border-b border-wedding-gold/15 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-wedding-charcoal">
                  Presentear os Noivos
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-wedding-cream rounded-xl transition-colors text-wedding-warmgray"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              /* TELA DE SUCESSO */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 border border-green-200 rounded-2xl flex items-center justify-center mx-auto text-green-600 shadow-inner">
                  <Check size={32} />
                </div>
                <h4 className="font-serif text-2xl text-wedding-charcoal">Muito Obrigado, {guestName}! 🎉</h4>
                <p className="text-wedding-warmgray text-sm max-w-sm mx-auto leading-relaxed">
                  Sua contribuição com o presente <strong>"{gift.name}"</strong> foi confirmada e registrada com muito amor!
                </p>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-wedding-charcoal text-white rounded-xl font-medium hover:bg-wedding-charcoal-light transition-all shadow-md"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            ) : (
              /* CONTEÚDO PRINCIPAL DO MODAL */
              <div className="space-y-6">
                {/* DETALHES DO ITEM */}
                <div className="bg-wedding-cream/60 rounded-2xl p-5 border border-wedding-gold/20 text-center">
                  <p className="font-serif text-xl sm:text-2xl text-wedding-charcoal font-semibold">{gift.name}</p>
                  {gift.description && (
                    <p className="text-wedding-warmgray text-xs sm:text-sm mt-1.5 leading-relaxed">{gift.description}</p>
                  )}
                  {gift.value > 0 && (
                    <p className="font-serif text-2xl text-wedding-gold mt-3 font-bold">
                      R$ {gift.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                {isSoldOut ? (
                  <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-800 text-sm font-medium">Este presente já foi esgotado!</p>
                  </div>
                ) : (
                  <>
                    {/* PASSO 1: LINK DA LOJA */}
                    {gift.link ? (
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-wedding-charcoal/80 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-wedding-gold text-white text-[11px] inline-flex items-center justify-center font-bold">1</span>
                          Comprar na loja
                        </span>
                        
                        <a
                          href={gift.link.startsWith('http') ? gift.link : `https://${gift.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-wedding-gold hover:bg-wedding-gold-dark text-white rounded-xl font-medium text-sm sm:text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                          <span>Acessar Link da Loja e Comprar</span>
                          <ExternalLink size={18} />
                        </a>
                        <p className="text-[11px] text-wedding-warmgray text-center">
                          O link abrirá em uma nova aba do seu navegador para você realizar a compra diretamente na loja.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 text-center">
                        <p className="text-xs text-amber-900 leading-relaxed">
                          Você pode adquirir este item na loja de sua preferência física ou online e confirmar abaixo.
                        </p>
                      </div>
                    )}

                    {/* PASSO 2: FORMULÁRIO DE CONFIRMAÇÃO */}
                    <form onSubmit={handleConfirmPurchase} className="space-y-4 pt-3 border-t border-wedding-gold/15">
                      <span className="text-xs font-semibold text-wedding-charcoal/80 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-wedding-charcoal text-white text-[11px] inline-flex items-center justify-center font-bold">2</span>
                        Confirmar que comprou
                      </span>

                      <div>
                        <label className="block text-xs font-medium text-wedding-charcoal mb-1">
                          Seu Nome Completo *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: Ana Silva"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm bg-white border border-wedding-gold/25 rounded-xl focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !guestName.trim()}
                        className="w-full py-3.5 bg-wedding-charcoal hover:bg-wedding-charcoal-light disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <HeartHandshake size={18} className="text-wedding-gold" />
                        <span>{loading ? 'Confirmando...' : 'Já comprei este presente'}</span>
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
