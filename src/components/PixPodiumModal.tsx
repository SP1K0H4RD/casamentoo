import { useState } from 'react';
import { motion } from 'framer-motion';
import { paymentService } from '../services/supabase';
import { weddingConfig } from '../config/weddingConfig';
import { Copy, Check, X, Heart, User, ArrowLeft } from 'lucide-react';

interface PixPodiumModalProps {
  onClose: () => void;
}

type ModalStep = 'input' | 'payment' | 'success';

export default function PixPodiumModal({ onClose }: PixPodiumModalProps) {
  const [step, setStep] = useState<ModalStep>('input');
  const [guestName, setGuestName] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pixKey = weddingConfig.pixKey || '12345678900';

  const handleValueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customValue.replace(',', '.'));
    if (!val || val <= 0) {
      alert('Por favor, informe um valor válido.');
      return;
    }
    setSelectedAmount(val);
    setStep('payment');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmPayment = async () => {
    if (!guestName.trim()) {
      alert('Por favor, informe seu nome antes de confirmar.');
      return;
    }

    setIsSubmitting(true);
    await paymentService.create({
      guest_name: guestName.trim(),
      gift_id: 'pix-special',
      gift_name: `Contribuição PIX — R$ ${selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      amount: selectedAmount,
      payment_method: 'pix',
    });
    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-wedding-gold/25 shadow-2xl relative my-8"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-wedding-cream border border-wedding-gold/40 hover:bg-wedding-charcoal hover:text-white text-wedding-charcoal flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* STEP 1: VALOR LIVRE */}
        {step === 'input' && (
          <div>
            <div className="text-center mb-8 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-wedding-gold/30 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                💛
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-wedding-charcoal">
                Presentear com PIX
              </h3>
              <p className="text-wedding-warmgray text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                Contribua com o valor que vier do seu coração. Qualquer quantia será recebida com muito amor!
              </p>
            </div>

            <form onSubmit={handleValueSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-2 text-center">
                  Valor do Presente (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg text-wedding-gold font-bold">R$</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    autoFocus
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-4 bg-wedding-cream/40 border border-wedding-gold/30 rounded-2xl text-center font-serif text-2xl text-wedding-charcoal font-bold focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-2">
                  <User size={12} className="inline text-wedding-gold mr-1" />
                  Seu nome (para os noivos saberem quem presenteou)
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ex: Tio Paulo e Família"
                  className="w-full px-4 py-3 bg-white border border-wedding-gold/30 rounded-xl text-wedding-charcoal placeholder:text-wedding-warmgray/50 focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-wedding-charcoal text-white rounded-2xl font-medium text-sm hover:bg-wedding-charcoal-light transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Heart size={16} className="text-wedding-gold fill-wedding-gold" />
                <span>Continuar para o PIX</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: PAGAMENTO */}
        {step === 'payment' && (
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-wedding-gold/15">
              <button
                onClick={() => setStep('input')}
                className="inline-flex items-center gap-1.5 text-xs text-wedding-warmgray hover:text-wedding-charcoal py-1 px-2 rounded-lg hover:bg-wedding-cream transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Alterar valor</span>
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-wedding-warmgray uppercase tracking-wider font-medium">Valor do Presente</p>
              <p className="font-serif text-4xl text-wedding-gold font-bold mt-1">
                R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-wedding-warmgray mt-1">Presenteado por: <strong className="text-wedding-charcoal">{guestName}</strong></p>
            </div>

            {/* PIX KEY BOX */}
            <div className="bg-wedding-cream/60 rounded-2xl p-4 sm:p-5 border border-wedding-gold/25 mb-4 text-center">
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl border border-wedding-gold/20 shadow-inner flex items-center justify-center mb-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixKey)}`}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-[11px] text-wedding-warmgray mb-1">
                Chave PIX: <strong className="text-wedding-charcoal font-mono select-all text-xs">{pixKey}</strong>
              </p>
              <p className="text-[11px] text-wedding-warmgray mb-3">
                Favorecido: <strong className="text-wedding-charcoal">{weddingConfig.pixName || 'Matheus e Ângela'}</strong>
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 px-4 bg-white border border-wedding-gold/40 hover:border-wedding-gold text-wedding-charcoal rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:bg-wedding-cream transition-all shadow-sm cursor-pointer"
              >
                {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} className="text-wedding-gold" />}
                <span>{copied ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmPayment}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Confirmando...' : 'Já fiz o pagamento ✓'}</span>
            </button>
          </div>
        )}

        {/* STEP 3: SUCESSO */}
        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-emerald-600">
              <Check size={32} />
            </div>
            <h3 className="font-serif text-2xl text-wedding-charcoal font-semibold">Muito Obrigado!</h3>
            <p className="text-wedding-warmgray text-sm mt-2 max-w-xs mx-auto leading-relaxed">
              Recebemos a confirmação do presente de{' '}
              <strong className="text-wedding-charcoal">{guestName}</strong> no valor de{' '}
              <strong className="text-wedding-charcoal">
                R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>.
            </p>
            <p className="text-xs text-wedding-gold mt-3 font-medium flex items-center justify-center gap-1">
              <Heart size={13} className="fill-wedding-gold" />
              <span>Matheus & Ângela agradecem de coração!</span>
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-wedding-charcoal text-white rounded-xl text-sm font-medium hover:bg-wedding-charcoal-light transition-colors cursor-pointer"
            >
              Concluir
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
