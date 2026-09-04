import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gift } from '../types';
import PixPayment from './PixPayment';
import { X } from 'lucide-react';

interface GiftModalProps {
  gift: Gift;
  onClose: () => void;
}

export default function GiftModal({ gift, onClose }: GiftModalProps) {
  const [step, setStep] = useState<'details' | 'pix'>('details');

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-wedding-charcoal">
                {step === 'details' ? 'Você escolheu' : 'Pagamento via PIX'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-wedding-cream rounded-lg transition-colors"
              >
                <X size={20} className="text-wedding-warmgray" />
              </button>
            </div>

            {step === 'details' ? (
              <div className="space-y-6">
                <div className="bg-wedding-cream rounded-xl p-6 text-center">
                  <p className="font-serif text-xl text-wedding-charcoal">{gift.name}</p>
                  <p className="text-wedding-warmgray text-sm mt-1">{gift.description}</p>
                  <p className="font-serif text-3xl text-wedding-gold mt-4">
                    R$ {gift.value.toLocaleString('pt-BR')}
                  </p>
                </div>

                {(gift.purchased_count ?? 0) >= (gift.max_quantity ?? 1) ? (
                  <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-800 text-sm font-medium">Este presente já foi esgotado!</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setStep('pix')}
                    className="w-full py-4 bg-wedding-charcoal text-white rounded-xl font-medium hover:bg-wedding-charcoal-light transition-colors"
                  >
                    Presentear
                  </button>
                )}
              </div>
            ) : (
              <PixPayment gift={gift} onClose={onClose} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
