import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { giftService } from '../../services/supabase';
import type { Gift } from '../../types';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

export default function GiftManagement() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [form, setForm] = useState({ name: '', description: '', value: 0, icon: 'heart', active: true });

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    const data = await giftService.getAllAdmin();
    setGifts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await giftService.update(editing.id, { ...form, value: Number(form.value) });
    } else {
      await giftService.create({ ...form, value: Number(form.value), order: gifts.length + 1 });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', value: 0, icon: 'heart', active: true });
    loadGifts();
  };

  const handleEdit = (gift: Gift) => {
    setEditing(gift);
    setForm({
      name: gift.name,
      description: gift.description,
      value: gift.value,
      icon: gift.icon || 'heart',
      active: gift.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este presente?')) {
      await giftService.delete(id);
      loadGifts();
    }
  };

  const handleToggle = async (gift: Gift) => {
    await giftService.update(gift.id, { active: !gift.active });
    loadGifts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-wedding-charcoal">Gerenciar Presentes</h3>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', value: 0, icon: 'heart', active: true }); }}
          className="flex items-center gap-2 px-4 py-2 bg-wedding-charcoal text-white rounded-lg text-sm hover:bg-wedding-charcoal-light transition-colors"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-xl p-6 shadow-sm border border-wedding-gold/10 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-wedding-warmgray mb-1">Nome</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-wedding-warmgray mb-1">Valor (R$)</label>
              <input
                required
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-wedding-warmgray mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold resize-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-wedding-charcoal">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-wedding-gold"
              />
              Ativo
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-wedding-charcoal text-white rounded-lg text-sm hover:bg-wedding-charcoal-light transition-colors">
              {editing ? 'Salvar alterações' : 'Criar presente'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-wedding-gold/30 rounded-lg text-sm text-wedding-charcoal hover:bg-wedding-cream transition-colors">
              Cancelar
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-wedding-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-wedding-cream">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Nome</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Valor</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-wedding-warmgray">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => (
                <tr key={gift.id} className="border-t border-wedding-gold/10">
                  <td className="px-6 py-4">
                    <p className="text-wedding-charcoal font-medium">{gift.name}</p>
                    <p className="text-wedding-warmgray text-xs">{gift.description}</p>
                  </td>
                  <td className="px-6 py-4 text-wedding-charcoal">
                    R$ {gift.value.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${gift.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {gift.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleToggle(gift)} className="p-2 hover:bg-wedding-cream rounded-lg transition-colors">
                        {gift.active ? <Eye size={16} className="text-wedding-warmgray" /> : <EyeOff size={16} className="text-wedding-warmgray" />}
                      </button>
                      <button onClick={() => handleEdit(gift)} className="p-2 hover:bg-wedding-cream rounded-lg transition-colors">
                        <Pencil size={16} className="text-wedding-warmgray" />
                      </button>
                      <button onClick={() => handleDelete(gift.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {gifts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-wedding-warmgray">
                    Nenhum presente cadastrado.
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
