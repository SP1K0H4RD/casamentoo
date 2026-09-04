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

  const isPix = (t: GiftTransaction) =>
    t.payment_method === 'pix' || t.gift_id === 'pix-special' || (!t.gift_id && t.payment_method !== 'store_link');

  const pixTransactions = transactions.filter((t) => isPix(t) && t.status === 'confirmed');
  const storeTransactions = transactions.filter((t) => !isPix(t) && t.status === 'confirmed');

  // Presentes comprados por item (quantidade)
  const giftCounts = gifts.map((gift) => {
    const count = storeTransactions.filter((t) => t.gift_id === gift.id).length;
    return { name: gift.name, count, max: gift.max_quantity ?? 1 };
  }).filter((g) => g.count > 0).sort((a, b) => b.count - a.count);

  // Histórico de PIX ao longo do tempo (apenas PIX em dinheiro)
  const pixDateMap = new Map<string, number>();
  pixTransactions.forEach((t) => {
    const date = new Date(t.created_at).toLocaleDateString('pt-BR');
    pixDateMap.set(date, (pixDateMap.get(date) || 0) + (Number(t.amount) || 0));
  });
  const pixDateEntries = Array.from(pixDateMap.entries()).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  const maxPixDateVal = Math.max(...pixDateEntries.map((d) => d[1]), 1);

  return (
    <div className="space-y-8">
      {/* GRÁFICO 1: PRESENTES ESCOLHIDOS / COMPRADOS */}
      <div>
        <h3 className="font-serif text-xl text-wedding-charcoal mb-4 flex items-center gap-2">
          <span>🎁</span> Presentes Comprados pelos Convidados
        </h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-wedding-gold/10 space-y-3">
          {giftCounts.length === 0 ? (
            <p className="text-wedding-warmgray text-center py-4">Nenhum presente comprado registrado ainda.</p>
          ) : (
            giftCounts.map((g) => (
              <div key={g.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-wedding-charcoal font-medium">{g.name}</span>
                  <span className="text-amber-800 font-semibold">{g.count} de {g.max} presenteados</span>
                </div>
                <div className="h-2.5 bg-wedding-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wedding-gold rounded-full transition-all duration-500"
                    style={{ width: `${(g.count / g.max) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* GRÁFICO 2: PIX ARRECADADO AO LONGO DO TEMPO */}
      <div>
        <h3 className="font-serif text-xl text-wedding-charcoal mb-4 flex items-center gap-2">
          <span>💛</span> PIX Arrecadado ao Longo do Tempo (R$)
        </h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-wedding-gold/10">
          {pixDateEntries.length === 0 ? (
            <p className="text-wedding-warmgray text-center py-4">Nenhum valor de PIX recebido ainda.</p>
          ) : (
            <div className="space-y-3">
              {pixDateEntries.map(([date, amount]) => (
                <div key={date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-wedding-warmgray">{date}</span>
                    <span className="text-emerald-800 font-bold">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="h-2.5 bg-wedding-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${(amount / maxPixDateVal) * 100}%` }}
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
