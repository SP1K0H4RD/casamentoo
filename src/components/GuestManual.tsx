import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { manualCards } from '../config/weddingConfig';
import { Shirt, Clock, Car, Baby, Sparkles, Check, ChevronDown } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  shirt: <Shirt size={22} />,
  clock: <Clock size={22} />,
  car: <Car size={22} />,
  baby: <Baby size={22} />,
  sparkles: <Sparkles size={22} />,
  check: <Check size={22} />,
};

export default function GuestManual() {
  const [openCard, setOpenCard] = useState<string | null>(null);

  return (
    <section id="manual" className="pt-6 pb-20 md:pb-24 bg-wedding-cream">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-wedding-gold text-xs tracking-[0.3em] uppercase font-medium">Informações</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-charcoal mt-2">
            Manual dos Convidados
          </h2>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid gap-3.5">
          {manualCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <button
                onClick={() => setOpenCard(openCard === card.id ? null : card.id)}
                className="w-full bg-white rounded-2xl p-5 sm:p-6 text-left shadow-sm border border-wedding-gold/15 hover:border-wedding-gold/30 hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold shrink-0">
                    {iconMap[card.icon || 'check']}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg text-wedding-charcoal">{card.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: openCard === card.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-wedding-warmgray" size={18} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openCard === card.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/60 rounded-b-2xl px-6 pb-5 pt-2 mx-1 border-x border-b border-wedding-gold/10">
                      <p className="text-wedding-warmgray text-sm leading-relaxed">{card.content}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
