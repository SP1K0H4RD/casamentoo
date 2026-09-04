-- ============================================================
-- SCRIPT PARA POPULAR OS PRESENTES NO SUPABASE
-- Execute este script no SQL Editor do seu painel Supabase
-- ============================================================

-- Apaga presentes antigos
DELETE FROM public.gifts;

-- Insere os presentes oficiais do casal
INSERT INTO public.gifts (name, description, value, icon, "order", active) VALUES
  ('Lua de Mel dos Sonhos',       'Contribua para momentos inesquecíveis na viagem de lua de mel dos noivos.', 150, 'plane',    1, true),
  ('Diária em Hotel Romântico',   'Uma estadia especial para descanso e celebração do casal.',                  250, 'hotel',    2, true),
  ('Jantar Romântico a Dois',     'Uma experiência gastronômica à luz de velas.',                               180, 'utensils', 3, true),
  ('Café da Manhã Especial',      'Um delicioso café da manhã para começar o novo ciclo com amor.',              90, 'coffee',   4, true),
  ('Passeio e Experiência a Dois','Passeios e aventuras para guardar para sempre na memória.',                  350, 'cloud',    5, true),
  ('Dia de Spa e Relaxamento',    'Um momento de paz e renovação para os noivos.',                              220, 'heart',    6, true);

-- Verifique se inseriu corretamente:
SELECT id, name, value, active, "order" FROM public.gifts ORDER BY "order";
