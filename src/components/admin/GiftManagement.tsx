import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { giftService } from '../../services/supabase';
import type { Gift } from '../../types';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function GiftManagement() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    value: 0,
    link: '',
    icon: 'heart',
    active: true,
    max_quantity: 1,
  });

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
      await giftService.update(editing.id, {
        ...form,
        value: Number(form.value),
        link: form.link.trim() || undefined,
        max_quantity: Math.max(1, Number(form.max_quantity || 1)),
      });
    } else {
      await giftService.create({
        ...form,
        value: Number(form.value),
        link: form.link.trim() || undefined,
        max_quantity: Math.max(1, Number(form.max_quantity || 1)),
        order: gifts.length + 1,
      });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', value: 0, link: '', icon: 'heart', active: true, max_quantity: 1 });
    loadGifts();
  };

  const handleEdit = (gift: Gift) => {
    setEditing(gift);
    setForm({
      name: gift.name,
      description: gift.description,
      value: gift.value,
      link: gift.link || '',
      icon: gift.icon || 'heart',
      active: gift.active,
      max_quantity: gift.max_quantity ?? 1,
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
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setForm({ name: '', description: '', value: 0, link: '', icon: 'heart', active: true, max_quantity: 1 });
          }}
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
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-wedding-warmgray mb-1">Nome *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-wedding-warmgray mb-1">Valor Sugerido (R$)</label>
              <input
                required
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-wedding-warmgray mb-1">
                Qtd. Permitida (Estoque)
              </label>
              <input
                required
                type="number"
                min="1"
                value={form.max_quantity}
                onChange={(e) => setForm({ ...form, max_quantity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold"
              />
              <p className="text-[11px] text-wedding-warmgray mt-1">
                1 = Exclusivo (único) | &gt; 1 = Vários compradores
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-wedding-warmgray mb-1 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-wedding-gold" />
              <span>Link da Loja / Produto (URL)</span>
            </label>
            <input
              type="url"
              placeholder="https://www.amazon.com.br/... ou link da loja onde comprar"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-4 py-2 border border-wedding-gold/20 rounded-lg focus:outline-none focus:border-wedding-gold text-sm"
            />
            <p className="text-[11px] text-wedding-warmgray mt-1">
              O convidado clicará neste link para ser redirecionado à página da loja e comprar o presente.
            </p>
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
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Presenteados / Limite</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-wedding-warmgray">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-wedding-warmgray">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => {
                const maxQty = gift.max_quantity ?? 1;
                const purchased = gift.purchased_count ?? 0;
                const isSoldOut = purchased >= maxQty;

                return (
                  <tr key={gift.id} className="border-t border-wedding-gold/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-wedding-charcoal font-medium">{gift.name}</p>
                        {gift.link && (
                          <a
                            href={gift.link.startsWith('http') ? gift.link : `https://${gift.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-wedding-gold hover:text-wedding-gold-dark font-medium bg-amber-50 px-2 py-0.5 rounded border border-wedding-gold/30"
                            title="Abrir link da loja"
                          >
                            <span>Loja</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      <p className="text-wedding-warmgray text-xs">{gift.description}</p>
                    </td>
                    <td className="px-6 py-4 text-wedding-charcoal">
                      R$ {gift.value.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-wedding-charcoal">
                          {purchased} / {maxQty}
                        </span>
                        {isSoldOut ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">
                            Esgotado
                          </span>
                        ) : maxQty === 1 ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 font-medium border border-amber-200">
                            Exclusivo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 font-medium">
                            {maxQty - purchased} disp.
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${gift.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {gift.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggle(gift)} className="p-2 hover:bg-wedding-cream rounded-lg transition-colors" title={gift.active ? 'Desativar' : 'Ativar'}>
                          {gift.active ? <Eye size={16} className="text-wedding-warmgray" /> : <EyeOff size={16} className="text-wedding-warmgray" />}
                        </button>
                        <button onClick={() => handleEdit(gift)} className="p-2 hover:bg-wedding-cream rounded-lg transition-colors" title="Editar presente">
                          <Pencil size={16} className="text-wedding-warmgray" />
                        </button>
                        <button onClick={() => handleDelete(gift.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Excluir presente">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {gifts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-wedding-warmgray">
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
