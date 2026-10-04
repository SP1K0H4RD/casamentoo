import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Volume2, VolumeX } from 'lucide-react';
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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(false);

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

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
    if (!nextMuted && isVisibleRef.current) {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }
  };

  // Auto-play slideshow effect
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

  // Audio setup and IntersectionObserver
  useEffect(() => {
    // Create Audio instance
    const audio = new Audio('/wedding-song.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Unlock browser audio context on any first user interaction
    const unlockAudio = () => {
      userInteractedRef.current = true;
      if (isVisibleRef.current && audioRef.current && !audioRef.current.muted) {
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('scroll', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // IntersectionObserver to detect when user reaches the carousel
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisibleRef.current = true;
            if (audioRef.current && !audioRef.current.muted) {
              // Always start from beginning as requested
              audioRef.current.currentTime = 0;
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsAudioPlaying(true);
                  })
                  .catch(() => {
                    // Autoplay prevented until user interaction
                    setIsAudioPlaying(false);
                  });
              }
            }
          } else {
            isVisibleRef.current = false;
            if (audioRef.current) {
              // Stop audio and reset to beginning when scrolling away (up or down)
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              setIsAudioPlaying(false);
            }
          }
        });
      },
      {
        threshold: 0.25, // Trigger when 25% of carousel is visible
      }
    );

    const currentElem = containerRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
      observer.disconnect();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
      ref={containerRef}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      className="mt-10 w-full max-w-xl mx-auto px-4 sm:px-6 select-none"
    >
      {/* Title Header with Music Indicator */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1.5 text-wedding-gold">
          <Sparkles size={16} />
          <span className="font-serif uppercase tracking-[0.2em] text-xs font-semibold text-wedding-charcoal/80">
            Nossa História em Fotos
          </span>
        </div>

        {/* Audio status pill button */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Ativar música' : 'Silenciar música'}
          title={isMuted ? 'Música silenciada (clique para ativar)' : 'Música ativa (clique para silenciar)'}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-wedding-gold/30 text-wedding-charcoal hover:text-wedding-gold shadow-sm backdrop-blur-sm text-[11px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX size={13} className="text-wedding-warmgray" />
              <span className="text-wedding-warmgray hidden sm:inline">Mudo</span>
            </>
          ) : (
            <>
              <Volume2 size={13} className={isAudioPlaying ? 'text-wedding-gold animate-pulse' : 'text-wedding-gold'} />
              <span className="text-wedding-gold font-medium hidden sm:inline">Música</span>
              {isAudioPlaying && (
                <span className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-0.5 h-2.5 bg-wedding-gold rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-0.5 h-3.5 bg-wedding-gold rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-0.5 h-2 bg-wedding-gold rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Main Slideshow Frame with Lateral Outer Arrows */}
      <div className="relative">
        {/* Navigation Arrow Left - Positioned Laterally */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Foto anterior"
          className="absolute -left-3 sm:-left-5 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-wedding-charcoal hover:text-wedding-gold flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl border border-wedding-gold/30 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Navigation Arrow Right - Positioned Laterally */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Próxima foto"
          className="absolute -right-3 sm:-right-5 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-wedding-charcoal hover:text-wedding-gold flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl border border-wedding-gold/30 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Photo Container Card */}
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

            {/* Top Right: Play/Pause Slideshow Button */}
            <div className="absolute top-3 right-3 z-20 flex items-center justify-end pointer-events-none">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
                title={isPlaying ? 'Clique para pausar' : 'Clique para reproduzir'}
                className="pointer-events-auto px-3 py-1 bg-black/40 hover:bg-black/65 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/20 flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
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
      </div>
    </motion.div>
  );
}
