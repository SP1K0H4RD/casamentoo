import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Image as ImageIcon } from 'lucide-react';
import { galleryPhotos } from '../config/galleryPhotos';

interface PhotoCarouselProps {
  autoPlayInterval?: number; // in milliseconds (default: 4000)
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 28 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 28 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  }),
};

export default function PhotoCarousel({ autoPlayInterval = 4000 }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = galleryPhotos.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide, autoPlayInterval]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  if (!galleryPhotos || galleryPhotos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      className="mt-10 w-full max-w-xl mx-auto px-2 select-none"
    >
      {/* Title Header */}
      <div className="flex items-center justify-center gap-2 mb-4 text-wedding-gold">
        <Sparkles size={16} />
        <span className="font-serif uppercase tracking-[0.2em] text-xs font-semibold text-wedding-charcoal/80">
          Nossa História em Fotos
        </span>
        <Sparkles size={16} />
      </div>

      {/* Main Slideshow Frame */}
      <div
        className="relative bg-white/90 p-3 sm:p-4 rounded-3xl border-2 border-wedding-gold/30 shadow-2xl backdrop-blur-md overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Photo Display Area */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-wedding-charcoal/5 shadow-inner">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {/* Soft blurred background for landscape/portrait blend */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
                style={{ backgroundImage: `url(${galleryPhotos[currentIndex]})` }}
              />

              {/* Crisp Original Image */}
              <img
                src={galleryPhotos[currentIndex]}
                alt={`Foto do casal ${currentIndex + 1}`}
                className="relative z-10 w-full h-full object-contain sm:object-cover object-center"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrow Left */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg border border-white/20"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Navigation Arrow Right */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg border border-white/20"
          >
            <ChevronRight size={22} />
          </button>

          {/* Top Bar: Counter & Play/Pause */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            {/* Badge Counter */}
            <div className="pointer-events-auto px-3 py-1 bg-black/45 backdrop-blur-md text-white rounded-full text-xs font-serif tracking-wider border border-white/20 flex items-center gap-1.5 shadow-sm">
              <ImageIcon size={12} className="text-wedding-gold" />
              <span>
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
              title={isPlaying ? 'Clique para pausar' : 'Clique para reproduzir'}
              className="pointer-events-auto px-3 py-1 bg-black/45 hover:bg-black/70 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/20 flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} className="text-wedding-gold fill-wedding-gold" />
                  <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Pausar</span>
                </>
              ) : (
                <>
                  <Play size={12} className="text-wedding-gold fill-wedding-gold" />
                  <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Reproduzir</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Progress Bar */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20 overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-wedding-gold/80 to-wedding-gold"
              />
            </div>
          )}
        </div>

        {/* Thumbnail Dots Bar */}
        <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap px-2">
          {galleryPhotos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Ir para a foto ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-2 ${
                idx === currentIndex
                  ? 'w-6 bg-wedding-gold shadow-sm'
                  : 'w-2 bg-wedding-charcoal/20 hover:bg-wedding-charcoal/40'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
