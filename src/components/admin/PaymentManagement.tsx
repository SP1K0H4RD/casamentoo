import { useState, useEffect } from 'react';
import { paymentService } from '../../services/supabase';
import type { GiftTransaction } from '../../types';
import { Search, CheckCircle, Clock, Trash2 } from 'lucide-react';

export default function PaymentManagement() {
  const [transactions, setTransactions] = useState<GiftTransaction[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await paymentService.getAll();
    setTransactions(data);
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'confirmed') => {
    await paymentService.updateStatus(id, status);
    loadTransactions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este pagamento?')) return;
    await paymentService.delete(id);
    loadTransactions();
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      t.gift_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalConfirmed = transactions
    .filter((t) => t.status === 'confirmed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-wedding-gold/10">
          <div className="flex items-center gap-2 text-wedding-warmgray text-sm mb-1">
            <CheckCircle size={16} className="text-green-500" />
            Confirmado
          </div>
          <p className="font-serif text-2xl text-wedding-charcoal">R$ {totalConfirmed.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-wedding-gold/10">
          <div className="flex items-center gap-2 text-wedding-warmgray text-sm mb-1">
            <Clock size={16} className="text-amber-500" />
            Pendente
          </div>
          <p className="font-serif text-2xl text-wedding-charcoal">R$ {totalPending.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wedding-warmgray" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-wedding-gold/20 rounded-xl focus:outline-none focus:border-wedding-gold"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-wedding-charcoal text-white'
                  : 'bg-white border border-wedding-gold/20 text-wedding-charcoal hover:bg-wedding-cream'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Confirmados'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-wedding-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-wedding-cream">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Convidado</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Presente</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Valor</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Data</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-wedding-warmgray">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-wedding-gold/10">
                  <td className="px-6 py-4 text-wedding-charcoal">{t.guest_name}</td>
                  <td className="px-6 py-4 text-wedding-warmgray">{t.gift_name}</td>
                  <td className="px-6 py-4 text-wedding-charcoal font-medium">
                    R$ {t.amount.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-wedding-warmgray text-sm">
                    {new Date(t.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      t.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {t.status === 'pending' ? (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'confirmed')}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                        >
                          Confirmar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'pending')}
                          className="px-3 py-1 border border-wedding-gold/30 rounded-lg text-xs text-wedding-warmgray hover:bg-wedding-cream transition-colors"
                        >
                          Reverter
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600"
                        title="Remover pagamento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-wedding-warmgray">
                    Nenhuma contribuição encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
