-- ============================================================
-- SCHEMA SUPABASE - SITE DE CASAMENTO
-- Execute estes comandos no SQL Editor do Supabase
-- ============================================================

-- Habilitar RLS em todas as tabelas
-- As políticas abaixo são um ponto de partida.
-- Em produção, ajuste conforme suas necessidades de segurança.

-- ============================================================
-- TABELA: gifts (Presentes simbólicos)
-- ============================================================
CREATE TABLE IF NOT EXISTS gifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    value NUMERIC(10,2) NOT NULL,
    image TEXT,
    icon TEXT DEFAULT 'heart',
    active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_gifts_active ON gifts(active);
CREATE INDEX idx_gifts_order ON gifts("order");

-- Política RLS (leitura pública, escrita apenas admin)
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gifts_select_public" ON gifts
    FOR SELECT USING (true);

CREATE POLICY "gifts_insert_admin" ON gifts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "gifts_update_admin" ON gifts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "gifts_delete_admin" ON gifts
    FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABELA: gift_transactions (Contribuições via PIX)
-- ============================================================
CREATE TABLE IF NOT EXISTS gift_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    gift_id UUID REFERENCES gifts(id) ON DELETE SET NULL,
    gift_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'pix',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_transactions_status ON gift_transactions(status);
CREATE INDEX idx_transactions_gift ON gift_transactions(gift_id);

-- Política RLS
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_admin" ON gift_transactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "transactions_insert_public" ON gift_transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "transactions_update_admin" ON gift_transactions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABELA: rsvps (Confirmações de presença)
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name TEXT NOT NULL,
    phone TEXT,
    guests_count INTEGER DEFAULT 1,
    notes TEXT,
    confirmed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_rsvps_confirmed ON rsvps(confirmed);

-- Política RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rsvps_select_admin" ON rsvps
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "rsvps_insert_public" ON rsvps
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- VIEW: Resumo administrativo
-- ============================================================
CREATE OR REPLACE VIEW admin_summary AS
SELECT
    (SELECT COUNT(*) FROM rsvps WHERE confirmed = true) AS guests_confirmed,
    (SELECT COALESCE(SUM(guests_count + 1), 0) FROM rsvps WHERE confirmed = true) AS total_people,
    (SELECT COUNT(*) FROM gift_transactions) AS gifts_registered,
    (SELECT COALESCE(SUM(amount), 0) FROM gift_transactions WHERE status = 'confirmed') AS pix_total;

-- ============================================================
-- DADOS INICIAIS (opcional - descomente se desejar)
-- ============================================================
/*
INSERT INTO gifts (name, description, value, icon, "order") VALUES
('Lua de Mel', 'Ajude os noivos a viverem uma lua de mel inesquecível.', 100, 'plane', 1),
('Uma noite especial', 'Uma noite em um hotel luxuoso para os noivos.', 250, 'hotel', 2),
('Jantar romântico', 'Um jantar à luz de velas em um restaurante especial.', 150, 'utensils', 3),
('Café da manhã na cama', 'Um café da manhã especial para começar o dia com amor.', 80, 'coffee', 4),
('Passeio de balão', 'Uma experiência única e inesquecível nas alturas.', 500, 'cloud', 5),
('Sessão de spa', 'Um dia de relaxamento e cuidados para o casal.', 300, 'heart', 6);
*/
