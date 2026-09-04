import { useState } from 'react';
import { motion } from 'framer-motion';
import { paymentService } from '../services/supabase';
import { weddingConfig } from '../config/weddingConfig';
import { Copy, Check, X, Sparkles, ArrowLeft, User, Heart } from 'lucide-react';

interface PixPodiumModalProps {
  onClose: () => void;
}

type ModalStep = 'select' | 'custom_input' | 'payment' | 'success';

export default function PixPodiumModal({ onClose }: PixPodiumModalProps) {
  const [step, setStep] = useState<ModalStep>('select');
  const [guestName, setGuestName] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(300);
  const [selectedLabel, setSelectedLabel] = useState<string>('🥇 Presente Ouro');
  const [customInputValue, setCustomInputValue] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pixKey = weddingConfig.pixKey || '12345678900';

  const handleSelectPodiumTier = (amount: number, label: string) => {
    setSelectedAmount(amount);
    setSelectedLabel(label);
    setStep('payment');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customInputValue);
    if (!val || val <= 0) {
      alert('Por favor, informe um valor válido.');
      return;
    }
    setSelectedAmount(val);
    setSelectedLabel('✨ Contribuição com Outro Valor');
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
    if (selectedAmount <= 0) {
      alert('Por favor, selecione um valor válido.');
      return;
    }

    setIsSubmitting(true);
    await paymentService.create({
      guest_name: guestName.trim(),
      gift_id: 'pix-special',
      gift_name: `${selectedLabel} (R$ ${selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
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
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-wedding-gold/25 shadow-2xl relative my-8"
      >
        {/* ULTRA-VISIBLE CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-wedding-cream border border-wedding-gold/40 hover:bg-wedding-charcoal hover:text-white text-wedding-charcoal flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* STEP 1: SELECT VALUE (PODIUM) - NO PIX KEY OR QR CODE YET */}
        {step === 'select' && (
          <div>
            <div className="text-center mb-6 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-wedding-gold/15 rounded-full text-wedding-gold text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles size={13} />
                <span>Presente com Carinho</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-wedding-charcoal">
                Presentear com PIX
              </h3>
              <p className="text-wedding-warmgray text-xs mt-1.5 max-w-sm mx-auto">
                Clique no valor que deseja presentear para gerar o QR Code e a chave PIX:
              </p>
            </div>

            {/* PODIUM BUTTONS */}
            <div className="grid grid-cols-3 gap-3 items-end pt-4 pb-4 mb-4">
              {/* 🥈 PRATA - R$ 200 (Left) */}
              <button
                type="button"
                onClick={() => handleSelectPodiumTier(200, '🥈 Presente Prata')}
                className="flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-400 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                style={{ minHeight: '140px' }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-bold shadow-sm group-hover:scale-110 transition-transform">
                  🥈
                </div>
                <div className="text-center my-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600">Prata</span>
                  <p className="font-serif text-lg sm:text-xl font-bold text-slate-800">R$ 200</p>
                </div>
                <span className="text-[10px] bg-slate-200/60 px-2 py-0.5 rounded-full text-slate-600 font-medium">Escolher</span>
              </button>

              {/* 🥇 OURO - R$ 300 (Center / Highlighted) */}
              <button
                type="button"
                onClick={() => handleSelectPodiumTier(300, '🥇 Presente Ouro')}
                className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-wedding-gold bg-gradient-to-b from-amber-50 to-amber-100/50 shadow-xl hover:shadow-2xl -translate-y-2 hover:-translate-y-3 ring-2 ring-wedding-gold/30 transition-all cursor-pointer group"
                style={{ minHeight: '165px' }}
              >
                <div className="w-12 h-12 rounded-full bg-wedding-gold/25 text-wedding-gold-dark flex items-center justify-center text-2xl font-bold shadow-sm group-hover:scale-110 transition-transform">
                  🥇
                </div>
                <div className="text-center my-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-wedding-gold-dark">Ouro</span>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-wedding-charcoal">R$ 300</p>
                </div>
                <span className="text-[10px] bg-wedding-gold text-white px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Destaque</span>
              </button>

              {/* 🥉 BRONZE - R$ 100 (Right) */}
              <button
                type="button"
                onClick={() => handleSelectPodiumTier(100, '🥉 Presente Bronze')}
                className="flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-amber-700/20 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-700/40 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                style={{ minHeight: '140px' }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold shadow-sm group-hover:scale-110 transition-transform">
                  🥉
                </div>
                <div className="text-center my-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800">Bronze</span>
                  <p className="font-serif text-lg sm:text-xl font-bold text-amber-900">R$ 100</p>
                </div>
                <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-full text-amber-800 font-medium">Escolher</span>
              </button>
            </div>

            {/* BUTTON FOR OTHER VALUES */}
            <div className="pt-2 text-center border-t border-wedding-gold/15">
              <button
                type="button"
                onClick={() => setStep('custom_input')}
                className="w-full py-3 px-4 bg-wedding-cream/60 hover:bg-wedding-cream border border-wedding-gold/30 rounded-xl text-xs sm:text-sm font-medium text-wedding-charcoal hover:border-wedding-gold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Contribuir com outros valores</span>
                <span className="text-wedding-gold">➔</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1.5: CUSTOM VALUE INPUT */}
        {step === 'custom_input' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setStep('select')}
                className="p-1.5 rounded-lg text-wedding-warmgray hover:text-wedding-charcoal hover:bg-wedding-cream transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="text-xs text-wedding-warmgray uppercase tracking-wider font-medium">Voltar ao pódio</span>
            </div>

            <div className="text-center mb-6">
              <h3 className="font-serif text-2xl text-wedding-charcoal">Definir Outro Valor</h3>
              <p className="text-wedding-warmgray text-xs mt-1">
                Digite a quantia com a qual deseja abençoar o casal:
              </p>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-1.5 text-center">
                  Valor do Presente (R$)
                </label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg text-wedding-gold font-bold">R$</span>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    required
                    autoFocus
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    placeholder="Ex: 150,00"
                    className="w-full pl-12 pr-4 py-3.5 bg-wedding-cream/40 border border-wedding-gold/30 rounded-xl text-center font-serif text-xl text-wedding-charcoal font-bold focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-center max-w-xs mx-auto">
                {['50', '150', '250', '500'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCustomInputValue(val)}
                    className="flex-1 py-1.5 px-2 bg-white border border-wedding-gold/25 rounded-lg text-xs font-medium text-wedding-charcoal hover:bg-wedding-gold/15 hover:border-wedding-gold transition-colors cursor-pointer"
                  >
                    R$ {val}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-wedding-charcoal text-white rounded-xl text-sm font-medium hover:bg-wedding-charcoal-light transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar para o PIX</span>
                <span className="text-wedding-gold">➔</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT WITH QR CODE, PIX KEY, NAME INPUT, CONFIRM BUTTON */}
        {step === 'payment' && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-wedding-gold/15">
              <button
                onClick={() => setStep('select')}
                className="inline-flex items-center gap-1.5 text-xs text-wedding-warmgray hover:text-wedding-charcoal py-1 px-2 rounded-lg hover:bg-wedding-cream transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Alterar valor</span>
              </button>
              <span className="text-xs font-semibold text-wedding-gold uppercase tracking-wider">{selectedLabel}</span>
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-wedding-warmgray uppercase tracking-wider font-medium">Valor Selecionado</p>
              <p className="font-serif text-3xl sm:text-4xl text-wedding-gold font-bold mt-0.5">
                R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* QR CODE & PIX KEY BOX */}
            <div className="bg-wedding-cream/60 rounded-2xl p-4 sm:p-5 border border-wedding-gold/25 mb-4 text-center">
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl border border-wedding-gold/20 shadow-inner flex items-center justify-center mb-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `00020126360014BR.GOV.BCB.PIX0114+558999999999520400005303986540${selectedAmount.toFixed(2)}5802BR5917Matheus e Angela6005PICOS62070503***6304`
                  )}`}
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
                <span>{copied ? 'Chave Copiada com Sucesso!' : 'Copiar Código / Chave PIX'}</span>
              </button>
            </div>

            {/* GUEST NAME FIELD & CONFIRMATION */}
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-wedding-charcoal/70 mb-1">
                  <User size={12} className="text-wedding-gold" />
                  Seu Nome / Família (para os noivos saberem quem presenteou) *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ex: Tio Paulo e Família"
                  className="w-full px-4 py-3 bg-white border border-wedding-gold/30 rounded-xl text-wedding-charcoal placeholder:text-wedding-warmgray/50 focus:outline-none focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 text-xs sm:text-sm"
                />
              </div>

              <button
                type="button"
                disabled={isSubmitting || !guestName.trim()}
                onClick={handleConfirmPayment}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Check size={16} />
                <span>{isSubmitting ? 'Confirmando...' : 'Confirmar que fiz o pagamento'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS / THANK YOU */}
        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-emerald-600">
              <Check size={32} />
            </div>
            <h3 className="font-serif text-2xl text-wedding-charcoal font-semibold">Muito Obrigado!</h3>
            <p className="text-wedding-warmgray text-xs sm:text-sm mt-2 max-w-xs mx-auto leading-relaxed">
              Recebemos sua confirmação de presente no valor de <strong className="text-wedding-charcoal">R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
            </p>
            <p className="text-xs text-wedding-gold mt-3 font-medium flex items-center justify-center gap-1">
              <Heart size={13} className="fill-wedding-gold" />
              <span>Matheus & Ângela agradecem de todo coração!</span>
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-wedding-charcoal text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-wedding-charcoal-light transition-colors cursor-pointer"
            >
              Concluir
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
