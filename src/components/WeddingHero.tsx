import { motion } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';
import { ChevronDown, Heart, Sparkles } from 'lucide-react';

export default function WeddingHero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-wedding-cream overflow-hidden pt-24 pb-8 md:pt-32 md:pb-10">
      {/* Decorative subtle background shapes */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute top-16 left-8 w-72 h-72 rounded-full border border-wedding-gold" />
        <div className="absolute bottom-16 right-8 w-96 h-96 rounded-full border border-wedding-gold" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Photo Card / Monogram Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="mb-8 mx-auto w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden bg-wedding-beige border-4 border-white shadow-2xl relative"
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#EAE0D0] p-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-wedding-gold/15 border border-wedding-gold/30 flex items-center justify-center mb-4 shadow-inner"
            >
              <Heart className="text-wedding-gold fill-wedding-gold/20" size={36} />
            </motion.div>
            <h3 className="font-serif text-2xl text-wedding-charcoal">M <span className="text-wedding-gold">&</span> Â</h3>
            <p className="text-wedding-gold text-xs tracking-widest uppercase mt-2 font-medium">16 . 12 . 2026</p>
            <p className="text-wedding-warmgray text-[11px] mt-4 uppercase tracking-wider">Espaço Celebre PH • Picos - PI</p>
          </div>
        </motion.div>

        {/* Couple Names */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-wedding-charcoal mb-2 tracking-wide">
            {weddingConfig.groomName} <span className="text-wedding-gold italic font-normal">&</span> {weddingConfig.brideName}
          </h1>
        </motion.div>

        {/* Date Badge strictly '16 . 12 . 2026' */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 inline-flex items-center gap-3 px-6 py-2 bg-white/80 backdrop-blur-sm border border-wedding-gold/30 rounded-full shadow-sm"
        >
          <Sparkles size={14} className="text-wedding-gold" />
          <p className="text-wedding-charcoal font-serif text-base sm:text-lg tracking-[0.25em] font-medium">
            16 . 12 . 2026
          </p>
          <Sparkles size={14} className="text-wedding-gold" />
        </motion.div>

        {/* Inspiring Devotional Wedding Message with Dedicated Font */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-8 bg-white/85 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-wedding-gold/25 shadow-lg relative text-center"
        >
          <div className="w-16 h-0.5 bg-wedding-gold/60 mx-auto mb-6" />
          <div className="space-y-4 font-script text-xl sm:text-2xl md:text-[26px] text-wedding-charcoal/90 italic leading-relaxed text-center tracking-wide font-normal">
            <p>
              “Esse é o dia que Deus preparou pra nós, e por essa razão estamos felizes.
            </p>
            <p>
              O amor é um sentimento que procede de Cristo, pois Ele é o próprio amor, portanto encontrar alguém a quem você ama e escolher passar a vida com essa pessoa é uma dádiva.
            </p>
            <p>
              A nossa história foi um presente do céu, na qual fomos forjados e amadurecidos no amor de Jesus, por essa razão, decidimos constituir nossa família firmados na graça de Cristo.
            </p>
            <p>
              Convidamos, com muito carinho, você para participar desse dia tão singular das nossas vidas, venha celebrar conosco a alegria da nossa união e do nosso amor!”
            </p>
          </div>
          <div className="w-16 h-0.5 bg-wedding-gold/60 mx-auto mt-6" />
        </motion.div>
      </div>

      {/* Scroll Down Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <span className="text-wedding-warmgray text-xs tracking-widest uppercase">
          Role para ver as informações do evento
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-wedding-gold" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
