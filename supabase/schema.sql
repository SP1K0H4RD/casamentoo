-- ============================================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO BANCO SUPABASE
-- Execute este script completo no SQL Editor do seu painel Supabase
-- ============================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA: gifts (Presentes da Lista de Casamento)
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    value NUMERIC(10,2) NOT NULL DEFAULT 0,
    image TEXT,
    icon TEXT DEFAULT 'heart',
    active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gifts_active ON public.gifts(active);
CREATE INDEX IF NOT EXISTS idx_gifts_order ON public.gifts("order");

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gifts_all_policy" ON public.gifts;
CREATE POLICY "gifts_all_policy" ON public.gifts FOR ALL USING (true) WITH CHECK (true);

-- 3. TABELA: gift_transactions (Contribuições e Pagamentos PIX)
CREATE TABLE IF NOT EXISTS public.gift_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    gift_id UUID REFERENCES public.gifts(id) ON DELETE SET NULL,
    gift_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'pix',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.gift_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.gift_transactions(created_at DESC);

ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "transactions_all_policy" ON public.gift_transactions;
CREATE POLICY "transactions_all_policy" ON public.gift_transactions FOR ALL USING (true) WITH CHECK (true);

-- 4. TABELA: rsvps (Confirmações de Presença)
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    phone TEXT,
    guests_count INTEGER DEFAULT 1,
    companions JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    confirmed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_confirmed ON public.rsvps(confirmed);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rsvps_all_policy" ON public.rsvps;
CREATE POLICY "rsvps_all_policy" ON public.rsvps FOR ALL USING (true) WITH CHECK (true);

-- 5. TABELA: guest_messages (Mural de Recados)
CREATE TABLE IF NOT EXISTS public.guest_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_messages_created ON public.guest_messages(created_at DESC);

ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_all_policy" ON public.guest_messages;
CREATE POLICY "messages_all_policy" ON public.guest_messages FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 6. DADOS INICIAIS DE PRESENTES
-- Limpa presentes antigos e insere a lista oficial do casal
-- ============================================================

-- Apaga tudo e insere do zero (garante consistência)
TRUNCATE TABLE public.gifts RESTART IDENTITY CASCADE;

INSERT INTO public.gifts (name, description, value, icon, "order", active) VALUES
  ('Lua de Mel dos Sonhos',      'Contribua para momentos inesquecíveis na viagem de lua de mel dos noivos.',      150, 'plane',    1, true),
  ('Diária em Hotel Romântico',  'Uma estadia especial para descanso e celebração do casal.',                       250, 'hotel',    2, true),
  ('Jantar Romântico a Dois',    'Uma experiência gastronômica à luz de velas.',                                    180, 'utensils', 3, true),
  ('Café da Manhã Especial',     'Um delicioso café da manhã para começar o novo ciclo com amor.',                   90, 'coffee',   4, true),
  ('Passeio & Experiência a Dois','Passeios e aventuras para guardar para sempre na memória.',                      350, 'cloud',    5, true),
  ('Dia de Spa & Relaxamento',   'Um momento de paz e renovação para os noivos.',                                   220, 'heart',    6, true);
