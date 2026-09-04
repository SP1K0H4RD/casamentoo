import { useState, useEffect } from 'react';
import { paymentService } from '../../services/supabase';
import type { GiftTransaction } from '../../types';
import { Search, CheckCircle, Clock, Trash2, Gift, QrCode, Layers } from 'lucide-react';

export default function PaymentManagement() {
  const [transactions, setTransactions] = useState<GiftTransaction[]>([]);
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState<'store_gifts' | 'pix' | 'all'>('store_gifts');
  const [pixStatusFilter, setPixStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

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

  const handleDelete = async (id: string, isStoreGift: boolean) => {
    const msg = isStoreGift
      ? 'Deseja remover este registro de compra? Ao remover, o presente voltará a ficar disponível para outros convidados na lista.'
      : 'Tem certeza que deseja remover este registro de PIX?';
    if (!confirm(msg)) return;
    await paymentService.delete(id);
    loadTransactions();
  };

  // Separação de tipos de transação
  const isPixTransaction = (t: GiftTransaction) =>
    t.payment_method === 'pix' || t.gift_id === 'pix-special' || (!t.gift_id && t.payment_method !== 'store_link');

  const pixTransactions = transactions.filter(isPixTransaction);
  const storeGiftTransactions = transactions.filter((t) => !isPixTransaction(t));

  // Totais de PIX (apenas dinheiro em conta)
  const totalPixConfirmed = pixTransactions
    .filter((t) => t.status === 'confirmed')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalPixPending = pixTransactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Totais de Presentes Comprados na Loja
  const totalStoreGiftsCount = storeGiftTransactions.length;
  const totalStoreGiftsEstimatedValue = storeGiftTransactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );

  // Filtros aplicados
  const getFilteredList = () => {
    let list: GiftTransaction[] = [];
    if (activeSection === 'store_gifts') {
      list = storeGiftTransactions;
    } else if (activeSection === 'pix') {
      list = pixTransactions.filter(
        (t) => pixStatusFilter === 'all' || t.status === pixStatusFilter
      );
    } else {
      list = transactions;
    }

    if (!search.trim()) return list;

    const term = search.toLowerCase();
    return list.filter(
      (t) =>
        t.guest_name?.toLowerCase().includes(term) ||
        t.gift_name?.toLowerCase().includes(term) ||
        t.guest_email?.toLowerCase().includes(term)
    );
  };

  const currentList = getFilteredList();

  return (
    <div className="space-y-6">
      {/* CARDS DE RESUMO (SEPARADOS CLARAMENTE) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CARD 1: PIX ARRECADADO (VALOR MONETÁRIO) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-500/20 bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <QrCode size={16} className="text-emerald-600" />
              PIX Arrecadado (Dinheiro)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-medium">
              {pixTransactions.length} {pixTransactions.length === 1 ? 'PIX' : 'PIXs'}
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-900">
            R$ {totalPixConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          {totalPixPending > 0 && (
            <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
              <Clock size={12} />
              <span>+ R$ {totalPixPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pendente</span>
            </p>
          )}
        </div>

        {/* CARD 2: PRESENTES COMPRADOS NA LOJA */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-500/20 bg-gradient-to-br from-white to-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Gift size={16} className="text-amber-600" />
              Presentes Comprados (Loja)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-medium">
              Itens da Lista
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-wedding-charcoal">
            {totalStoreGiftsCount} <span className="text-lg font-sans font-normal text-wedding-warmgray">itens</span>
          </p>
          <p className="text-xs text-wedding-warmgray mt-1">
            Valor de referência: R$ {totalStoreGiftsEstimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* CARD 3: TOTAL DE CONTRIBUIÇÕES */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-wedding-gold/20 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-wedding-warmgray flex items-center gap-1.5">
              <Layers size={16} className="text-wedding-gold" />
              Total de Contribuições
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-wedding-charcoal">
            {transactions.length} <span className="text-lg font-sans font-normal text-wedding-warmgray">registros</span>
          </p>
          <p className="text-xs text-wedding-warmgray mt-1">
            {totalStoreGiftsCount} presentes + {pixTransactions.length} em PIX
          </p>
        </div>
      </div>

      {/* ABAS DE NAVEGAÇÃO INTERNA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-wedding-gold/20 pb-3">
        <div className="flex items-center gap-2 bg-wedding-cream/60 p-1 rounded-xl border border-wedding-gold/20">
          <button
            onClick={() => setActiveSection('store_gifts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeSection === 'store_gifts'
                ? 'bg-wedding-charcoal text-white shadow-sm'
                : 'text-wedding-charcoal hover:bg-white/60'
            }`}
          >
            <Gift size={15} />
            <span>Presentes Comprados</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeSection === 'store_gifts' ? 'bg-wedding-gold text-wedding-charcoal' : 'bg-wedding-gold/20 text-wedding-charcoal'
            }`}>
              {totalStoreGiftsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('pix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeSection === 'pix'
                ? 'bg-wedding-charcoal text-white shadow-sm'
                : 'text-wedding-charcoal hover:bg-white/60'
            }`}
          >
            <QrCode size={15} />
            <span>Valores em PIX</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeSection === 'pix' ? 'bg-wedding-gold text-wedding-charcoal' : 'bg-wedding-gold/20 text-wedding-charcoal'
            }`}>
              {pixTransactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeSection === 'all'
                ? 'bg-wedding-charcoal text-white shadow-sm'
                : 'text-wedding-charcoal hover:bg-white/60'
            }`}
          >
            <Layers size={15} />
            <span>Todos</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeSection === 'all' ? 'bg-wedding-gold text-wedding-charcoal' : 'bg-wedding-gold/20 text-wedding-charcoal'
            }`}>
              {transactions.length}
            </span>
          </button>
        </div>

        {/* SUBFILTRO DE PIX (CASO NA ABA PIX) */}
        {activeSection === 'pix' && (
          <div className="flex gap-1.5">
            {(['all', 'confirmed', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPixStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pixStatusFilter === f
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-wedding-gold/20 text-wedding-charcoal hover:bg-wedding-cream'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'confirmed' ? 'Confirmados' : 'Pendentes'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-wedding-warmgray" size={18} />
        <input
          type="text"
          placeholder="Buscar por convidado, presente ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-wedding-gold/20 rounded-xl focus:outline-none focus:border-wedding-gold text-sm shadow-sm"
        />
      </div>

      {/* ============================================================ */}
      {/* SEÇÃO 1: TABELA DE PRESENTES COMPRADOS NA LOJA */}
      {/* ============================================================ */}
      {activeSection === 'store_gifts' && (
        <div className="bg-white rounded-2xl shadow-sm border border-wedding-gold/10 overflow-hidden">
          <div className="px-6 py-4 bg-amber-50/40 border-b border-wedding-gold/10 flex items-center justify-between">
            <div>
              <h4 className="font-serif text-lg text-wedding-charcoal font-semibold flex items-center gap-2">
                <span>🎁</span> Presentes Comprados pelos Convidados (Loja)
              </h4>
              <p className="text-xs text-wedding-warmgray mt-0.5">
                Estes são os itens que os convidados compraram via link externo e confirmaram no convite.
              </p>
            </div>
            <span className="text-xs font-medium text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              {currentList.length} itens escolhidos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-wedding-cream/60">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Convidado</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Presente Escolhido</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Valor Ref.</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Data da Escolha</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Status</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((t) => (
                  <tr key={t.id} className="border-t border-wedding-gold/10 hover:bg-wedding-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-wedding-charcoal font-medium text-sm">{t.guest_name}</p>
                      {t.guest_email && <p className="text-wedding-warmgray text-xs">{t.guest_email}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-wedding-charcoal text-sm">{t.gift_name}</span>
                    </td>
                    <td className="px-6 py-4 text-wedding-charcoal text-sm font-medium">
                      R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-wedding-warmgray text-xs">
                      {new Date(t.created_at).toLocaleDateString('pt-BR')} às {new Date(t.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle size={12} />
                        Presenteado
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(t.id, true)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600 inline-flex items-center gap-1 text-xs"
                        title="Remover e liberar presente na lista"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Liberar</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {currentList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-wedding-warmgray">
                      Nenhum presente comprado registrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SEÇÃO 2: TABELA DE VALORES EM PIX */}
      {/* ============================================================ */}
      {activeSection === 'pix' && (
        <div className="bg-white rounded-2xl shadow-sm border border-wedding-gold/10 overflow-hidden">
          <div className="px-6 py-4 bg-emerald-50/40 border-b border-wedding-gold/10 flex items-center justify-between">
            <div>
              <h4 className="font-serif text-lg text-wedding-charcoal font-semibold flex items-center gap-2">
                <span>💛</span> Contribuições Financeiras via PIX
              </h4>
              <p className="text-xs text-wedding-warmgray mt-0.5">
                Valores enviados via PIX diretamente na chave dos noivos.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
              Total: R$ {totalPixConfirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-wedding-cream/60">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Convidado</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Valor do PIX</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Data</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Status</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((t) => (
                  <tr key={t.id} className="border-t border-wedding-gold/10 hover:bg-wedding-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-wedding-charcoal font-medium text-sm">{t.guest_name}</p>
                      {t.guest_email && <p className="text-wedding-warmgray text-xs">{t.guest_email}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-serif text-base font-bold text-emerald-800">
                        R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-wedding-warmgray text-xs">
                      {new Date(t.created_at).toLocaleDateString('pt-BR')} às {new Date(t.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status === 'confirmed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {t.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === 'pending' ? (
                          <button
                            onClick={() => handleUpdateStatus(t.id, 'confirmed')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
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
                          onClick={() => handleDelete(t.id, false)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600"
                          title="Remover registro de PIX"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-wedding-warmgray">
                      Nenhum pagamento PIX encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SEÇÃO 3: VISÃO UNIFICADA (TODOS) */}
      {/* ============================================================ */}
      {activeSection === 'all' && (
        <div className="bg-white rounded-2xl shadow-sm border border-wedding-gold/10 overflow-hidden">
          <div className="px-6 py-4 bg-wedding-cream/60 border-b border-wedding-gold/10 flex items-center justify-between">
            <h4 className="font-serif text-lg text-wedding-charcoal font-semibold">
              Histórico Completo de Arrecadações
            </h4>
            <span className="text-xs text-wedding-warmgray">
              {currentList.length} registros no total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-wedding-cream/40">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Tipo</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Convidado</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Item / Descrição</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Valor</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Data</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-wedding-warmgray">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((t) => {
                  const isPix = isPixTransaction(t);
                  return (
                    <tr key={t.id} className="border-t border-wedding-gold/10 hover:bg-wedding-cream/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isPix ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isPix ? <QrCode size={12} /> : <Gift size={12} />}
                          {isPix ? 'PIX' : 'Presente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-wedding-charcoal font-medium text-sm">{t.guest_name}</p>
                        {t.guest_email && <p className="text-wedding-warmgray text-xs">{t.guest_email}</p>}
                      </td>
                      <td className="px-6 py-4 text-wedding-charcoal text-sm">
                        {t.gift_name}
                      </td>
                      <td className="px-6 py-4 font-medium text-wedding-charcoal text-sm">
                        R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-wedding-warmgray text-xs">
                        {new Date(t.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(t.id, !isPix)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {currentList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-wedding-warmgray">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
