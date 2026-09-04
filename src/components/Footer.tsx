import { motion } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 bg-wedding-charcoal text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-serif text-3xl md:text-4xl">
            {weddingConfig.groomName} <span className="text-wedding-gold">&</span> {weddingConfig.brideName}
          </h3>
          <p className="text-wedding-gold mt-2 tracking-[0.25em] text-sm font-medium">
            16 . 12 . 2026 • Espaço Celebre PH • Picos - PI
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
            <span className="text-sm">Obrigado por fazer parte da nossa história</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart size={16} className="text-wedding-gold fill-wedding-gold" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
