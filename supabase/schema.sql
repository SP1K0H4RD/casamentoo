-- ============================================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO BANCO SUPABASE
-- Execute este script completo no SQL Editor do seu painel Supabase
-- ============================================================

-- CASO A TABELA JÁ EXISTA E QUEIRA APENAS ADICIONAR AS COLUNAS DE ESTOQUE E LINK:
-- ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS max_quantity INTEGER DEFAULT 1;
-- ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS link TEXT;
-- UPDATE public.gifts SET max_quantity = 1 WHERE max_quantity IS NULL;

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
    link TEXT,
    active BOOLEAN DEFAULT true,
    max_quantity INTEGER DEFAULT 1,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garante que as colunas novas existem mesmo se a tabela já foi criada anteriormente
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS max_quantity INTEGER DEFAULT 1;
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS link TEXT;

CREATE INDEX IF NOT EXISTS idx_gifts_active ON public.gifts(active);
CREATE INDEX IF NOT EXISTS idx_gifts_order ON public.gifts("order");

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gifts_all_policy" ON public.gifts;
CREATE POLICY "gifts_all_policy" ON public.gifts FOR ALL USING (true) WITH CHECK (true);

-- 3. TABELA: gift_transactions (Contribuições e Pagamentos de Presentes / PIX)
CREATE TABLE IF NOT EXISTS public.gift_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    gift_id UUID REFERENCES public.gifts(id) ON DELETE SET NULL,
    gift_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'store_link',
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed')),
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
