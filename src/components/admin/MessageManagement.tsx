import { useState, useEffect } from 'react';
import { messageService } from '../../services/supabase';
import type { GuestMessage } from '../../types';
import { Trash2, MessageSquareHeart, Search, Sparkles } from 'lucide-react';

export default function MessageManagement() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await messageService.getAll();
    setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o recado de "${name}"?`)) {
      await messageService.delete(id);
      await loadMessages();
    }
  };

  const filteredMessages = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-wedding-gold/15 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-wedding-gold/15 flex items-center justify-center text-wedding-gold">
            <MessageSquareHeart size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-wedding-charcoal">Mural de Recados ({messages.length})</h3>
            <p className="text-xs text-wedding-warmgray">Mensagens e votos deixados pelos convidados</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar por nome ou texto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-wedding-cream/40 border border-wedding-gold/25 rounded-xl text-xs focus:outline-none focus:border-wedding-gold text-wedding-charcoal"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-wedding-warmgray" />
        </div>
      </div>

      {/* Messages List / Grid */}
      {loading ? (
        <div className="text-center py-12 text-wedding-warmgray text-sm">Carregando recados...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-wedding-gold/15">
          <MessageSquareHeart size={36} className="text-wedding-gold/40 mx-auto mb-3" />
          <p className="font-serif text-base text-wedding-charcoal">Nenhum recado encontrado</p>
          <p className="text-xs text-wedding-warmgray mt-1">
            {search ? 'Tente outra busca.' : 'Quando os convidados enviarem mensagens pelo mural, elas aparecerão aqui.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-2xl p-5 border border-wedding-gold/20 shadow-sm flex flex-col justify-between group hover:border-wedding-gold/40 hover:shadow-md transition-all relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-wedding-gold/10 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-wedding-gold/15 text-wedding-gold flex items-center justify-center text-xs font-semibold">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-wedding-charcoal leading-tight">{msg.name}</h4>
                      <p className="text-[10px] text-wedding-warmgray">
                        {new Date(msg.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    title="Excluir este recado"
                    className="p-1.5 text-wedding-warmgray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-wedding-charcoal/90 text-xs sm:text-sm leading-relaxed italic">
                  “{msg.message}”
                </p>
              </div>

              <div className="mt-4 pt-2 flex items-center gap-1.5 text-wedding-gold text-[10px] font-medium">
                <Sparkles size={11} />
                <span>Mensagem do Convidado</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
