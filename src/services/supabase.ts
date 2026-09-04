import { createClient } from '@supabase/supabase-js';
import type { Gift, GiftTransaction, RSVP, GuestMessage } from '../types';
import { mockGifts } from '../config/weddingConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase client
export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'local');

// Mock data store para protótipo e persistência local
const mockStore = {
  gifts: JSON.parse(localStorage.getItem('mock_gifts') || '[]'),
  transactions: JSON.parse(localStorage.getItem('mock_transactions') || '[]'),
  rsvps: JSON.parse(localStorage.getItem('mock_rsvps') || '[]'),
  messages: JSON.parse(localStorage.getItem('mock_guest_messages') || '[]'),
};

// Inicializar com dados mock se vazio
function initMockData() {
  if (!mockStore.gifts.length) {
    mockStore.gifts = [...mockGifts];
    localStorage.setItem('mock_gifts', JSON.stringify(mockStore.gifts));
  }
}

export const giftService = {
  async getAll(): Promise<Gift[]> {
    initMockData();
    return mockStore.gifts.filter((g: Gift) => g.active).sort((a: Gift, b: Gift) => a.order - b.order);
  },

  async getAllAdmin(): Promise<Gift[]> {
    initMockData();
    return mockStore.gifts.sort((a: Gift, b: Gift) => a.order - b.order);
  },

  async create(gift: Omit<Gift, 'id' | 'created_at'>): Promise<Gift> {
    const newGift = { ...gift, id: Date.now().toString(), created_at: new Date().toISOString() };
    mockStore.gifts.push(newGift);
    localStorage.setItem('mock_gifts', JSON.stringify(mockStore.gifts));
    return newGift;
  },

  async update(id: string, updates: Partial<Gift>): Promise<Gift> {
    const idx = mockStore.gifts.findIndex((g: Gift) => g.id === id);
    if (idx === -1) throw new Error('Gift not found');
    mockStore.gifts[idx] = { ...mockStore.gifts[idx], ...updates };
    localStorage.setItem('mock_gifts', JSON.stringify(mockStore.gifts));
    return mockStore.gifts[idx];
  },

  async delete(id: string): Promise<void> {
    mockStore.gifts = mockStore.gifts.filter((g: Gift) => g.id !== id);
    localStorage.setItem('mock_gifts', JSON.stringify(mockStore.gifts));
  },
};

export const rsvpService = {
  async create(rsvp: Omit<RSVP, 'id' | 'created_at' | 'confirmed'>): Promise<RSVP> {
    const newRsvp = {
      ...rsvp,
      id: Date.now().toString(),
      confirmed: true,
      created_at: new Date().toISOString(),
    };
    mockStore.rsvps.push(newRsvp);
    localStorage.setItem('mock_rsvps', JSON.stringify(mockStore.rsvps));
    return newRsvp;
  },

  async getAll(): Promise<RSVP[]> {
    return mockStore.rsvps;
  },
};

export const paymentService = {
  async create(transaction: Omit<GiftTransaction, 'id' | 'created_at' | 'status'>): Promise<GiftTransaction> {
    const newTx = {
      ...transaction,
      id: Date.now().toString(),
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };
    mockStore.transactions.push(newTx);
    localStorage.setItem('mock_transactions', JSON.stringify(mockStore.transactions));
    return newTx;
  },

  async getAll(): Promise<GiftTransaction[]> {
    return mockStore.transactions;
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed'): Promise<void> {
    const idx = mockStore.transactions.findIndex((t: GiftTransaction) => t.id === id);
    if (idx !== -1) {
      mockStore.transactions[idx].status = status;
      localStorage.setItem('mock_transactions', JSON.stringify(mockStore.transactions));
    }
  },
};

export const messageService = {
  async getAll(): Promise<GuestMessage[]> {
    return [...mockStore.messages].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async create(msg: Omit<GuestMessage, 'id' | 'created_at'>): Promise<GuestMessage> {
    const newMsg: GuestMessage = {
      ...msg,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    mockStore.messages.unshift(newMsg);
    localStorage.setItem('mock_guest_messages', JSON.stringify(mockStore.messages));
    return newMsg;
  },

  async delete(id: string): Promise<void> {
    mockStore.messages = mockStore.messages.filter((m: GuestMessage) => m.id !== id);
    localStorage.setItem('mock_guest_messages', JSON.stringify(mockStore.messages));
  },
};
