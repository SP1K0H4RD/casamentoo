import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { rsvpService, paymentService, giftService } from '../../services/supabase';
import type { RSVP, GiftTransaction } from '../../types';
import { Users, Gift as GiftIcon, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    guestsConfirmed: 0,
    totalPeople: 0,
    giftsRegistered: 0,
    pixTotal: 0,
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
      const confirmedTransactions = transactions.filter((t: GiftTransaction) => t.status === 'confirmed');
      const pixTotal = confirmedTransactions.reduce((sum: number, t: GiftTransaction) => sum + t.amount, 0);

      setStats({
        guestsConfirmed: confirmedRsvps.length,
        totalPeople,
        giftsRegistered: gifts.length || transactions.length,
        pixTotal,
      });
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Convidados confirmados', value: stats.guestsConfirmed, icon: Users },
    { label: 'Total de pessoas', value: stats.totalPeople, icon: TrendingUp },
    { label: 'Presentes disponíveis', value: stats.giftsRegistered, icon: GiftIcon },
    { label: 'PIX arrecadado', value: `R$ ${stats.pixTotal.toLocaleString('pt-BR')}`, icon: DollarSign },
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
