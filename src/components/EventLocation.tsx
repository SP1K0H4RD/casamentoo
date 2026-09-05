import { motion } from 'framer-motion';
import { weddingConfig } from '../config/weddingConfig';
import { MapPin, Clock, Calendar, Sparkles } from 'lucide-react';
import Map from './Map';

export default function EventLocation() {
  return (
    <section id="location" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-wedding-gold text-xs tracking-[0.3em] uppercase font-medium">Local do Evento</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-charcoal mt-2">
            Cerimônia & Recepção
          </h2>
          <p className="text-wedding-warmgray text-sm mt-3 max-w-lg mx-auto">
            Para o seu maior conforto, toda a nossa celebração acontecerá em um único e acolhedor espaço.
          </p>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mt-6" />
        </motion.div>

        {/* Unified Venue Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-wedding-cream rounded-3xl p-6 sm:p-10 border border-wedding-gold/20 shadow-md mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center border-b border-wedding-gold/15 pb-8 mb-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-wedding-charcoal mb-2">
                {weddingConfig.venueName}
              </h3>
              <p className="text-wedding-warmgray text-sm flex items-start gap-2 mt-3">
                <MapPin className="text-wedding-gold shrink-0 mt-0.5" size={18} />
                <span>{weddingConfig.venueAddress}</span>
              </p>
            </div>

            <div className="space-y-4 bg-white/70 p-5 rounded-2xl border border-wedding-gold/15">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-wedding-warmgray uppercase tracking-wider font-semibold">Data</p>
                  <p className="text-wedding-charcoal font-serif text-base capitalize">
                    {new Date(weddingConfig.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-wedding-warmgray uppercase tracking-wider font-semibold">Horário da Cerimônia</p>
                  <p className="text-wedding-charcoal font-serif text-base">18:30h (Início pontual)</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-wedding-gold/10 flex items-center justify-center text-wedding-gold shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs text-wedding-warmgray uppercase tracking-wider font-semibold">Recepção & Cerimônia</p>
                  <p className="text-wedding-charcoal font-serif text-base">No mesmo local</p>
                </div>
              </div>
            </div>
          </div>

          <Map />
        </motion.div>
      </div>
    </section>
  );
}
