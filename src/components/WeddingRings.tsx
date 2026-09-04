import { motion } from 'framer-motion';

interface WeddingRingsProps {
  className?: string;
  size?: number;
}

export default function WeddingRings({ className = '', size = 180 }: WeddingRingsProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Warm Golden Glow behind rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-40 h-40 bg-gradient-to-tr from-amber-400/20 via-yellow-200/25 to-amber-500/10 rounded-full blur-2xl pointer-events-none"
      />

      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_16px_rgba(201,169,110,0.25)] overflow-visible"
      >
        <defs>
          {/* Gold Gradient - Band 1 (Left / Groom Ring) */}
          <linearGradient id="goldRing1" x1="20" y1="50" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF2A1" />
            <stop offset="25%" stopColor="#DFB76C" />
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="75%" stopColor="#8F6B22" />
            <stop offset="100%" stopColor="#E6C878" />
          </linearGradient>

          {/* Gold Gradient - Band 2 (Right / Bride Ring) */}
          <linearGradient id="goldRing2" x1="100" y1="30" x2="220" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="20%" stopColor="#E5C16C" />
            <stop offset="45%" stopColor="#B38728" />
            <stop offset="70%" stopColor="#DFC06A" />
            <stop offset="90%" stopColor="#8C6418" />
            <stop offset="100%" stopColor="#FFF099" />
          </linearGradient>

          {/* Diamond Gradient */}
          <linearGradient id="diamondGrad" x1="165" y1="18" x2="175" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E0F7FA" />
            <stop offset="80%" stopColor="#80DEEA" />
            <stop offset="100%" stopColor="#B2EBF2" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="ringShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4a3608" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* RING 1: Groom's Classic Gold Wedding Band (Left)         */}
        {/* ======================================================== */}
        <motion.g
          initial={{ x: -40, opacity: 0, scale: 0.85 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Outer ring */}
          <ellipse
            cx="82"
            cy="100"
            rx="46"
            ry="46"
            stroke="url(#goldRing1)"
            strokeWidth="11"
            filter="url(#ringShadow)"
          />
          {/* Inner ring highlight bevel */}
          <ellipse
            cx="82"
            cy="100"
            rx="41"
            ry="41"
            stroke="#FFF5B8"
            strokeWidth="1.2"
            opacity="0.8"
          />
          {/* Outer rim shadow accent */}
          <ellipse
            cx="82"
            cy="100"
            rx="51.5"
            ry="51.5"
            stroke="#6B4D0F"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </motion.g>

        {/* ======================================================== */}
        {/* RING 2: Bride's Solitaire Diamond Ring (Right, Interlocked) */}
        {/* ======================================================== */}
        <motion.g
          initial={{ x: 40, opacity: 0, scale: 0.85 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {/* The full ring body */}
          <g transform="rotate(-18 152 92)">
            <ellipse
              cx="152"
              cy="92"
              rx="46"
              ry="46"
              stroke="url(#goldRing2)"
              strokeWidth="10"
              filter="url(#ringShadow)"
            />
            {/* Inner ring highlight */}
            <ellipse
              cx="152"
              cy="92"
              rx="41.5"
              ry="41.5"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.85"
            />
          </g>
        </motion.g>

        {/* ======================================================== */}
        {/* SOLITAIRE DIAMOND & PRONGS ON BRIDE'S RING               */}
        {/* ======================================================== */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: 'spring', stiffness: 200 }}
          style={{ transformOrigin: '144px 44px' }}
        >
          {/* Diamond Setting Crown Base */}
          <path
            d="M 137 50 L 151 50 L 148 55 L 140 55 Z"
            fill="#C9A96E"
            stroke="#8F6B22"
            strokeWidth="0.8"
          />
          {/* Diamond Setting 4 Prongs */}
          <line x1="137" y1="49" x2="135" y2="40" stroke="#E5C16C" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="151" y1="49" x2="153" y2="40" stroke="#E5C16C" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="144" y1="49" x2="144" y2="38" stroke="#FFF2A1" strokeWidth="1.5" strokeLinecap="round" />

          {/* Brilliant Cut Diamond Facets */}
          <polygon
            points="144,32 153,41 144,50 135,41"
            fill="url(#diamondGrad)"
            stroke="#FFFFFF"
            strokeWidth="1"
            filter="drop-shadow(0 0 6px rgba(255, 255, 255, 0.9))"
          />
          {/* Diamond Inner Facet Lines */}
          <polygon points="144,32 148,41 144,47 140,41" fill="#FFFFFF" opacity="0.6" />
          <line x1="135" y1="41" x2="153" y2="41" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />

          {/* Diamond Sparkle Flare 1 (Main Starburst) */}
          <motion.g
            animate={{
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 45, 90, 135, 180],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '144px 38px' }}
          >
            {/* Horizontal Flare */}
            <path d="M 130 38 Q 144 37 158 38 Q 144 39 130 38 Z" fill="#FFFFFF" opacity="0.9" />
            {/* Vertical Flare */}
            <path d="M 144 24 Q 143 38 144 52 Q 145 38 144 24 Z" fill="#FFFFFF" opacity="0.9" />
            {/* Center Glistening Dot */}
            <circle cx="144" cy="38" r="2.5" fill="#FFFFFF" filter="drop-shadow(0 0 4px #FFFFFF)" />
          </motion.g>
        </motion.g>

        {/* Ambient Shimmer Sparkles */}
        <motion.circle
          cx="78"
          cy="70"
          r="1.5"
          fill="#FFF7C2"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="178"
          cy="120"
          r="2"
          fill="#FFF7C2"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
        />
      </svg>
    </div>
  );
}
