export interface WeddingConfig {
  groomName: string;
  brideName: string;
  date: string; // ISO date
  ceremonyTime: string;
  receptionTime: string;
  venueName: string;
  venueAddress: string;
  latitude: number;
  longitude: number;
  pixKey: string;
  pixName: string;
  pixCity: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  value: number;
  image?: string;
  icon?: string;
  link?: string | null;
  active: boolean;
  order: number;
  max_quantity?: number;
  purchased_count?: number;
  created_at?: string;
}

export interface GiftTransaction {
  id: string;
  guest_name: string;
  guest_email?: string;
  gift_id: string;
  gift_name: string;
  amount: number;
  payment_method: 'pix' | 'store_link' | string;
  status: 'pending' | 'confirmed';
  created_at: string;
}

export interface RSVP {
  id: string;
  guest_name: string;
  guests_count: number;
  companions?: string[];
  confirmed: boolean;
  created_at: string;
}

export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface ManualCard {
  id: string;
  title: string;
  icon: string;
  content: string;
}
