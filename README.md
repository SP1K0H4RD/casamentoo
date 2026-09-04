# 💍 Site de Casamento — Renata & Gean

Um convite digital premium, moderno e interativo para casamento, inspirado no design elegante e minimalista de referências como o site da plataforma Casar.com.

## ✨ Funcionalidades

### Para Convidados
- 🎬 **Animação de entrada** com alianças SVG e transição cinematográfica
- 🔐 **Senha de acesso** ao convite (configurável)
- ⏱️ **Contador regressivo** em tempo real para o grande dia
- 📖 **Linha do tempo interativa** da história do casal
- 📋 **Manual dos convidados** com cards expansíveis
- 🗺️ **Mapa do Google Maps** com localização do evento
- 🎁 **Lista de presentes simbólicos** com pagamento via PIX
- 📋 **RSVP** — confirmação de presença com formulário elegante

### Para Administradores (Painel /admin)
- 📊 **Dashboard** com indicadores em tempo real
- 👥 **Gerenciamento de convidados** com busca e filtros
- 🎁 **CRUD de presentes** — adicionar, editar, ativar/desativar
- 💰 **Controle de contribuições PIX** — confirmar/reverter pagamentos
- 📈 **Gráficos** de arrecadação por presente e ao longo do tempo

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Framer Motion** (animações)
- **React Router** (navegação)
- **Supabase** (backend/database — pronto para integração)
- **Lucide React** (ícones)
- **date-fns** (manipulação de datas)

## 📦 Instalação

```bash
# 1. Clone ou extraia o projeto
cd wedding-site

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

## ⚙️ Configuração

### Dados do Casamento

Edite o arquivo `src/config/weddingConfig.ts`:

```typescript
export const weddingConfig: WeddingConfig = {
  groomName: 'Gean',
  brideName: 'Renata',
  date: '2026-12-12',           // Data do casamento (ISO)
  ceremonyTime: '16:00',
  receptionTime: '18:00',
  venueName: 'Igreja Matriz...',
  venueAddress: 'R. da Conceição, 123',
  latitude: -3.7327,            // Coordenadas para o mapa
  longitude: -38.5270,
  guestPassword: 'CASAMENTO2026', // Senha dos convidados
  adminPassword: 'ADMIN123',      // Senha do painel admin
  pixKey: '12345678900',          // Chave PIX
  pixName: 'Renata e Gean',
  pixCity: 'FORTALEZA',
};
```

### Chave PIX

Configure no mesmo arquivo `weddingConfig.ts`:
- `pixKey`: Sua chave PIX (CPF, CNPJ, e-mail, telefone ou chave aleatória)
- `pixName`: Nome do beneficiário (máx. 25 caracteres)
- `pixCity`: Cidade (máx. 15 caracteres)

### Fotos do Casal

Substitua os placeholders nos componentes:
- `src/components/WeddingHero.tsx` — Foto principal
- `src/components/CoupleStory.tsx` — Galeria de fotos

### Variáveis de Ambiente (.env)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_ADMIN_PASSWORD=ADMIN123
VITE_GUEST_PASSWORD=CASAMENTO2026
```

## 🗄️ Supabase — Configuração do Banco

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor** → **New query**
3. Cole o conteúdo do arquivo `supabase/schema.sql`
4. Execute o script

### Estrutura das Tabelas

| Tabela | Descrição |
|--------|-----------|
| `gifts` | Presentes simbólicos disponíveis |
| `gift_transactions` | Contribuições PIX registradas |
| `rsvps` | Confirmações de presença |

### Integração com o Frontend

No arquivo `src/services/supabase.ts`, substitua as funções mock pelas chamadas reais do Supabase:

```typescript
// Exemplo: substituir mock por Supabase real
export const giftService = {
  async getAll(): Promise<Gift[]> {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('active', true)
      .order('order');
    if (error) throw error;
    return data || [];
  },
  // ... demais métodos
};
```

## 🔐 Segurança

> ⚠️ **Atenção**: As senhas configuradas no `weddingConfig.ts` são temporárias para o protótipo.
>
> Em produção:
> - Use **Supabase Auth** para autenticação real
> - Configure **Row Level Security (RLS)** nas tabelas
> - Nunca exponha chaves de API no frontend
> - Use variáveis de ambiente para credenciais

## 📱 Design

- **Mobile-first**: Otimizado para acesso via WhatsApp
- **Paleta**: Off-white, dourado discreto, preto suave
- **Tipografia**: Playfair Display (títulos) + Inter (corpo)
- **Animações**: Suaves e cinematográficas, sem exageros

## 🖥️ Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build |

## 📄 Licença

Projeto privado — uso exclusivo do casal.

---

Feito com 💛 para Renata & Gean
