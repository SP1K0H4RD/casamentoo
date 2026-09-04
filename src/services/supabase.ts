import { createClient } from '@supabase/supabase-js';
import type { Gift, GiftTransaction, RSVP, GuestMessage } from '../types';

const supabaseUrl = 'https://ugeiquqqkboogbndsgnc.supabase.co';
const supabaseKey = 'sb_publishable_9iMQ71jjDI4EVk1Ai2xnwg_3gKhU7pB';

// Supabase client - always connected to the shared database
export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = true;

// ------------------------------------------------------------
// GIFT SERVICE - SEMPRE USA O SUPABASE (sem fallback local)
// ------------------------------------------------------------
export const giftService = {
  async getAll(): Promise<Gift[]> {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('active', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('Erro ao carregar presentes do Supabase:', error.message);
      return [];
    }

    return (data ?? []) as Gift[];
  },

  async getAllAdmin(): Promise<Gift[]> {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Erro ao carregar presentes (admin) do Supabase:', error.message);
      return [];
    }

    return (data ?? []) as Gift[];
  },

  async create(gift: Omit<Gift, 'id' | 'created_at'>): Promise<Gift> {
    const { data, error } = await supabase
      .from('gifts')
      .insert([gift])
      .select()
      .single();

    if (error || !data) {
      throw new Error('Erro ao criar presente: ' + (error?.message ?? 'sem dados'));
    }

    return data as Gift;
  },

  async update(id: string, updates: Partial<Gift>): Promise<Gift> {
    const { data, error } = await supabase
      .from('gifts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error('Erro ao atualizar presente: ' + (error?.message ?? 'sem dados'));
    }

    return data as Gift;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('gifts').delete().eq('id', id);

    if (error) {
      throw new Error('Erro ao deletar presente: ' + error.message);
    }
  },
};

// ------------------------------------------------------------
// RSVP SERVICE
// ------------------------------------------------------------
export const rsvpService = {
  async create(rsvp: Omit<RSVP, 'id' | 'created_at' | 'confirmed'>): Promise<RSVP> {
    const { data, error } = await supabase
      .from('rsvps')
      .insert([
        {
          guest_name: rsvp.guest_name,
          guests_count: rsvp.guests_count,
          companions: rsvp.companions || [],
          confirmed: true,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new Error('Erro ao salvar confirmação: ' + (error?.message ?? 'sem dados'));
    }

    return data as RSVP;
  },

  async getAll(): Promise<RSVP[]> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar RSVPs:', error.message);
      return [];
    }

    return (data ?? []) as RSVP[];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('rsvps').delete().eq('id', id);
    if (error) throw new Error('Erro ao deletar confirmação: ' + error.message);
  },
};

// ------------------------------------------------------------
// PAYMENT / PIX SERVICE
// ------------------------------------------------------------
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const paymentService = {
  async create(transaction: Omit<GiftTransaction, 'id' | 'created_at' | 'status'>): Promise<GiftTransaction> {
    const giftId = transaction.gift_id && UUID_REGEX.test(transaction.gift_id) ? transaction.gift_id : null;

    const { data, error } = await supabase
      .from('gift_transactions')
      .insert([
        {
          guest_name: transaction.guest_name,
          guest_email: transaction.guest_email || null,
          gift_id: giftId,
          gift_name: transaction.gift_name,
          amount: transaction.amount,
          payment_method: transaction.payment_method || 'pix',
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new Error('Erro ao registrar transação: ' + (error?.message ?? 'sem dados'));
    }

    return data as GiftTransaction;
  },

  async getAll(): Promise<GiftTransaction[]> {
    const { data, error } = await supabase
      .from('gift_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error.message);
      return [];
    }

    return (data ?? []) as GiftTransaction[];
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed'): Promise<void> {
    const { error } = await supabase
      .from('gift_transactions')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw new Error('Erro ao atualizar status: ' + error.message);
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('gift_transactions').delete().eq('id', id);
    if (error) throw new Error('Erro ao deletar transação: ' + error.message);
  },
};

// ------------------------------------------------------------
// MESSAGE / MURAL SERVICE
// ------------------------------------------------------------
export const messageService = {
  async getAll(): Promise<GuestMessage[]> {
    const { data, error } = await supabase
      .from('guest_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar mensagens:', error.message);
      return [];
    }

    return (data ?? []) as GuestMessage[];
  },

  async create(msg: Omit<GuestMessage, 'id' | 'created_at'>): Promise<GuestMessage> {
    const { data, error } = await supabase
      .from('guest_messages')
      .insert([msg])
      .select()
      .single();

    if (error || !data) {
      throw new Error('Erro ao enviar mensagem: ' + (error?.message ?? 'sem dados'));
    }

    return data as GuestMessage;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('guest_messages').delete().eq('id', id);

    if (error) {
      throw new Error('Erro ao deletar mensagem: ' + error.message);
    }
  },
};
