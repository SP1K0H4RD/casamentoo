import type { WeddingConfig, Gift } from '../types';

export const weddingConfig: WeddingConfig = {
  groomName: 'Matheus Pacífico',
  brideName: 'Ângela Tributino',
  date: '2026-12-16',
  ceremonyTime: '18:30',
  receptionTime: 'A seguir (mesmo local)',
  venueName: 'Espaço Celebre PH do Picos Hotel',
  venueAddress: 'Av. Senador Helvídio Nunes, 1485 - Catavento, Picos - PI',
  latitude: -7.0772,
  longitude: -41.4674,
  pixKey: '89994189841',
  pixName: 'Matheus e Ângela',
  pixCity: 'PICOS',
};

export const manualCards = [
  {
    id: 'dresscode',
    title: 'Dress Code',
    icon: 'shirt',
    content: 'Traje esporte fino / passeio completo. Sugerimos tons elegantes e confortáveis. Evite branco e tons marfim/off-white para preservar a exclusividade da noiva.',
  },
  {
    id: 'horario',
    title: 'Horário & Pontualidade',
    icon: 'clock',
    content: 'A celebração iniciará pontualmente às 18:30h no Espaço Celebre PH. Pedimos a gentileza de chegar com 20 a 30 minutos de antecedência.',
  },
  {
    id: 'estacionamento',
    title: 'Estacionamento & Local',
    icon: 'car',
    content: 'O Picos Hotel conta com área de estacionamento e fácil acesso para veículos e serviços de transporte por aplicativo.',
  },
  {
    id: 'criancas',
    title: 'Família & Crianças',
    icon: 'baby',
    content: 'O ambiente é climatizado, acolhedor e preparado com todo o carinho para receber sua família com total conforto e segurança.',
  },
  {
    id: 'cerimonia_recepcao',
    title: 'Recepção e Cerimônia Integrados',
    icon: 'sparkles',
    content: 'Para o seu conforto, tanto a celebração religiosa quanto a recepção acontecerão no mesmo local (Espaço Celebre PH).',
  },
  {
    id: 'confirmacao',
    title: 'Confirmação de Presença',
    icon: 'check',
    content: 'Por favor, confirme sua presença através do formulário abaixo para que possamos organizar todos os detalhes com o devido carinho.',
  },
];

export const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Lua de Mel dos Sonhos',
    description: 'Contribua para momentos inesquecíveis na viagem de lua de mel dos noivos.',
    value: 150,
    icon: 'plane',
    active: true,
    order: 1,
  },
  {
    id: '2',
    name: 'Diária em Hotel Romântico',
    description: 'Uma estadia especial para descanso e celebração do casal.',
    value: 250,
    icon: 'hotel',
    active: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Jantar Romântico a Dois',
    description: 'Uma experiência gastronômica comemoração à luz de velas.',
    value: 180,
    icon: 'utensils',
    active: true,
    order: 3,
  },
  {
    id: '4',
    name: 'Café da Manhã Especial',
    description: 'Um delicioso café da manhã para começar o novo ciclo com amor.',
    value: 90,
    icon: 'coffee',
    active: true,
    order: 4,
  },
  {
    id: '5',
    name: 'Passeio & Experiência a Dois',
    description: 'Passeios e aventuras para guardar para sempre na memória.',
    value: 350,
    icon: 'cloud',
    active: true,
    order: 5,
  },
  {
    id: '6',
    name: 'Dia de Spa & Relaxamento',
    description: 'Um momento de paz e renovação para os noivos.',
    value: 220,
    icon: 'heart',
    active: true,
    order: 6,
  },
];
