import { useState, useEffect } from 'react';
import { paymentService, giftService } from '../../services/supabase';
import type { GiftTransaction, Gift } from '../../types';

export default function Charts() {
  const [transactions, setTransactions] = useState<GiftTransaction[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    Promise.all([paymentService.getAll(), giftService.getAllAdmin()]).then(([tx, g]) => {
      setTransactions(tx);
      setGifts(g);
    });
  }, []);

  const giftTotals = gifts.map((gift) => {
    const total = transactions
      .filter((t) => t.gift_id === gift.id && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: gift.name, total };
  }).filter((g) => g.total > 0).sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...giftTotals.map((g) => g.total), 1);

  // Group by date
  const dateMap = new Map<string, number>();
  transactions
    .filter((t) => t.status === 'confirmed')
    .forEach((t) => {
      const date = new Date(t.created_at).toLocaleDateString('pt-BR');
      dateMap.set(date, (dateMap.get(date) || 0) + t.amount);
    });
  const dateEntries = Array.from(dateMap.entries()).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  const maxDateVal = Math.max(...dateEntries.map((d) => d[1]), 1);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif text-xl text-wedding-charcoal mb-4">Arrecadação por Presente</h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-wedding-gold/10 space-y-3">
          {giftTotals.length === 0 ? (
            <p className="text-wedding-warmgray text-center py-4">Nenhuma contribuição confirmada ainda.</p>
          ) : (
            giftTotals.map((g) => (
              <div key={g.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-wedding-charcoal">{g.name}</span>
                  <span className="text-wedding-charcoal font-medium">R$ {g.total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-2 bg-wedding-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wedding-gold rounded-full transition-all duration-500"
                    style={{ width: `${(g.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl text-wedding-charcoal mb-4">Contribuições ao Longo do Tempo</h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-wedding-gold/10">
          {dateEntries.length === 0 ? (
            <p className="text-wedding-warmgray text-center py-4">Nenhuma contribuição confirmada ainda.</p>
          ) : (
            <div className="space-y-3">
              {dateEntries.map(([date, amount]) => (
                <div key={date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-wedding-warmgray">{date}</span>
                    <span className="text-wedding-charcoal font-medium">R$ {amount.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="h-2 bg-wedding-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-wedding-charcoal rounded-full transition-all duration-500"
                      style={{ width: `${(amount / maxDateVal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
