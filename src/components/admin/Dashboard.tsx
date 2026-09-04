import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { rsvpService, paymentService, giftService } from '../../services/supabase';
import type { RSVP, GiftTransaction } from '../../types';
import { Users, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    guestsConfirmed: 0,
    totalPeople: 0,
    storeGiftsPurchased: 0,
    totalGiftsAvailable: 0,
    pixTotal: 0,
    pixCount: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const [rsvps, transactions, gifts] = await Promise.all([
        rsvpService.getAll(),
        paymentService.getAll(),
        giftService.getAllAdmin(),
      ]);

      const confirmedRsvps = rsvps.filter((r: RSVP) => r.confirmed);
      const totalPeople = confirmedRsvps.reduce((sum: number, r: RSVP) => sum + (r.guests_count || 1), 0);

      const isPix = (t: GiftTransaction) =>
        t.payment_method === 'pix' || t.gift_id === 'pix-special' || (!t.gift_id && t.payment_method !== 'store_link');

      const pixTransactions = transactions.filter(isPix);
      const confirmedPix = pixTransactions.filter((t: GiftTransaction) => t.status === 'confirmed');
      const pixTotal = confirmedPix.reduce((sum: number, t: GiftTransaction) => sum + (Number(t.amount) || 0), 0);

      const storeGiftTransactions = transactions.filter((t: GiftTransaction) => !isPix(t));

      setStats({
        guestsConfirmed: confirmedRsvps.length,
        totalPeople,
        storeGiftsPurchased: storeGiftTransactions.length,
        totalGiftsAvailable: gifts.length,
        pixTotal,
        pixCount: confirmedPix.length,
      });
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Convidados confirmados', value: stats.guestsConfirmed, icon: Users },
    { label: 'Total de pessoas', value: stats.totalPeople, icon: TrendingUp },
    { label: 'PIX arrecadado', value: `R$ ${stats.pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign },
    { label: 'Presentes comprados', value: `${stats.storeGiftsPurchased} de ${stats.totalGiftsAvailable} itens`, icon: ShoppingBag },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-wedding-gold/10"
        >
          <div className="flex items-center justify-between mb-4">
            <card.icon className="text-wedding-gold" size={24} />
          </div>
          <p className="font-serif text-2xl text-wedding-charcoal">{card.value}</p>
          <p className="text-wedding-warmgray text-sm mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
