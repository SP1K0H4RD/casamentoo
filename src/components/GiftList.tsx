import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { giftService } from '../services/supabase';
import type { Gift } from '../types';
import GiftModal from './GiftModal';
import PixPodiumModal from './PixPodiumModal';
import { Plane, Hotel, Utensils, Coffee, Cloud, Heart, QrCode, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  plane: <Plane size={26} />,
  hotel: <Hotel size={26} />,
  utensils: <Utensils size={26} />,
  coffee: <Coffee size={26} />,
  cloud: <Cloud size={26} />,
  heart: <Heart size={26} />,
};

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isPixPodiumOpen, setIsPixPodiumOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    giftService.getAll().then((data) => {
      setGifts(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="gifts" className="py-24 md:py-32 bg-wedding-cream relative">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-wedding-gold text-xs tracking-[0.3em] uppercase font-medium">Lista de Presentes</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-charcoal mt-2">
            Presentes Simbólicos
          </h2>
          <p className="text-wedding-warmgray text-sm mt-3 max-w-lg mx-auto">
            Sua presença é nossa maior celebração! Mas caso deseje nos presentear, criamos formas simples e especiais de contribuir.
          </p>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mt-6" />
        </motion.div>

        {/* 💛 UM PRESENTE ESPECIAL PARA NÓS (PIX SECTION) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-wedding-gold/25 shadow-lg text-center mb-16 max-w-2xl mx-auto relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-wedding-gold/30 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
            💛
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-wedding-charcoal mb-3">
            Um presente especial para nós
          </h3>
          <p className="text-wedding-warmgray text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Se você deseja nos presentear, nossa preferência é pelo Pix. Dessa forma, você pode contribuir para esse novo capítulo das nossas vidas de uma maneira simples e prática, e nós poderemos escolher com carinho como utilizar esse presente.
          </p>

          <button
            onClick={() => setIsPixPodiumOpen(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-wedding-charcoal text-white rounded-2xl font-medium tracking-wide hover:bg-wedding-charcoal-light active:scale-[0.99] transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <QrCode size={18} className="text-wedding-gold" />
            <span className="text-sm sm:text-base">Presentear com PIX</span>
            <Sparkles size={16} className="text-wedding-gold" />
          </button>
        </motion.div>

        {/* 🎁 OUTRAS FORMAS DE PRESENTEAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">🎁</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-wedding-charcoal">
              Outras formas de presentear
            </h3>
          </div>
          <p className="text-wedding-warmgray text-sm max-w-xl mx-auto leading-relaxed">
            Mas, se você preferir nos presentear de outra maneira, também ficaremos muito felizes. Para facilitar sua escolha, reunimos algumas sugestões de itens que serão muito especiais para o nosso novo lar.
          </p>
        </motion.div>

        {/* PREEXISTING GIFTS GRID */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, index) => {
              const maxQty = gift.max_quantity ?? 1;
              const purchased = gift.purchased_count ?? 0;
              const isSoldOut = purchased >= maxQty;

              return (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={isSoldOut ? {} : { y: -4 }}
                  className={`bg-white rounded-3xl p-6 shadow-sm border transition-all flex flex-col justify-between relative overflow-hidden ${
                    isSoldOut
                      ? 'opacity-40 border-gray-300 bg-gray-50/70 cursor-not-allowed select-none'
                      : 'border-wedding-gold/20 hover:border-wedding-gold/40 hover:shadow-lg cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isSoldOut) {
                      setSelectedGift(gift);
                    }
                  }}
                >
                  {/* BADGE DE ESGOTADO / QUANTIDADE */}
                  {isSoldOut ? (
                    <div className="absolute top-4 right-4 bg-gray-800/85 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase shadow-sm flex items-center gap-1.5">
                      <span>🔒</span> Já Presenteado
                    </div>
                  ) : maxQty > 1 ? (
                    <div className="absolute top-4 right-4 bg-wedding-cream text-wedding-charcoal/80 border border-wedding-gold/30 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide">
                      {maxQty - purchased} de {maxQty} disponíveis
                    </div>
                  ) : null}

                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      isSoldOut ? 'bg-gray-200 text-gray-400' : 'bg-wedding-gold/10 text-wedding-gold'
                    }`}>
                      {iconMap[gift.icon || 'heart']}
                    </div>
                    <h4 className={`font-serif text-lg font-semibold ${isSoldOut ? 'text-gray-500 line-through' : 'text-wedding-charcoal'}`}>
                      {gift.name}
                    </h4>
                    <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isSoldOut ? 'text-gray-400' : 'text-wedding-warmgray'}`}>
                      {isSoldOut ? 'Este presente já foi escolhido por alguém especial. Obrigado pelo carinho!' : gift.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-wedding-gold/15 flex items-center justify-between">
                    <span className={`font-serif text-xl font-bold ${isSoldOut ? 'text-gray-400' : 'text-wedding-charcoal'}`}>
                      R$ {gift.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {isSoldOut ? (
                      <span className="px-4 py-2 bg-gray-300 text-gray-600 text-xs font-semibold rounded-xl cursor-not-allowed">
                        Esgotado
                      </span>
                    ) : (
                      <button className="px-4 py-2 bg-wedding-charcoal text-white text-xs font-medium rounded-xl hover:bg-wedding-charcoal-light transition-colors">
                        Presentear
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* PIX PODIUM MODAL */}
      {isPixPodiumOpen && (
        <PixPodiumModal onClose={() => setIsPixPodiumOpen(false)} />
      )}

      {/* INDIVIDUAL GIFT MODAL */}
      {selectedGift && (
        <GiftModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
      )}
    </section>
  );
}
