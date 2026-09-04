import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RingIntro from '../components/RingIntro';
import Navigation from '../components/Navigation';
import WeddingHero from '../components/WeddingHero';
import GuestManual from '../components/GuestManual';
import EventLocation from '../components/EventLocation';
import GiftList from '../components/GiftList';
import RSVPForm from '../components/RSVPForm';
import MessagesWall from '../components/MessagesWall';
import Footer from '../components/Footer';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleAuthenticated = () => {
    setAuthenticated(true);
    setTimeout(() => setShowIntro(false), 900);
  };

  return (
    <div className="min-h-screen bg-wedding-cream">
      <AnimatePresence mode="wait">
        {showIntro && (
          <RingIntro onAuthenticated={handleAuthenticated} />
        )}
      </AnimatePresence>

      {authenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <Navigation />
          <WeddingHero />
          <GuestManual />
          <EventLocation />
          <GiftList />
          <RSVPForm />
          <MessagesWall />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
