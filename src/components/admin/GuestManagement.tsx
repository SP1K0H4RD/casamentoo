import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rsvpService } from '../../services/supabase';
import type { RSVP } from '../../types';
import { Search, Users, Calendar } from 'lucide-react';

export default function GuestManagement() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    rsvpService.getAll().then(setRsvps);
  }, []);

  const filtered = rsvps.filter((r) =>
    r.guest_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wedding-warmgray" size={18} />
          <input
            type="text"
            placeholder="Buscar convidado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-wedding-gold/20 rounded-xl focus:outline-none focus:border-wedding-gold"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-wedding-gold/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-wedding-cream">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Nome</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Acompanhantes</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Total</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Data</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rsvp) => (
              <tr key={rsvp.id} className="border-t border-wedding-gold/10">
                <td className="px-6 py-4 text-wedding-charcoal">{rsvp.guest_name}</td>
                <td className="px-6 py-4 text-wedding-warmgray">{rsvp.guests_count}</td>
                <td className="px-6 py-4 text-wedding-charcoal font-medium">{rsvp.guests_count + 1}</td>
                <td className="px-6 py-4 text-wedding-warmgray text-sm">
                  {new Date(rsvp.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Confirmado
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-wedding-warmgray">
                  Nenhum convidado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((rsvp) => (
          <motion.div
            key={rsvp.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-wedding-gold/10"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-wedding-charcoal">{rsvp.guest_name}</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Confirmado</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-wedding-warmgray">
                <Users size={14} />
                {rsvp.guests_count} acompanhantes
              </div>
              <div className="flex items-center gap-2 text-wedding-warmgray">
                <Calendar size={14} />
                {new Date(rsvp.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-wedding-warmgray">
            Nenhum convidado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
