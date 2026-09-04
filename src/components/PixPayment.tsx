import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Gift } from '../types';
import { paymentService } from '../services/supabase';
import { weddingConfig } from '../config/weddingConfig';
import { Copy, Check, QrCode } from 'lucide-react';

interface PixPaymentProps {
  gift: Gift;
  onClose: () => void;
}

function generatePixCode(key: string, name: string, city: string, amount: number, description: string): string {
  // Simplified PIX payload generation (BR Code)
  const merchantAccount = `0014BR.GOV.BCB.PIX01${key.length.toString().padStart(2, '0')}${key}`;
  const transactionAmount = `${amount.toFixed(2)}`;
  const merchantName = name.length > 25 ? name.substring(0, 25) : name;
  const merchantCity = city.length > 15 ? city.substring(0, 15) : city;

  const payload = [
    '000201',
    '26' + (merchantAccount.length + 4).toString().padStart(2, '0') + '0014BR.GOV.BCB.PIX' + merchantAccount,
    '52040000',
    '5303986',
    '54' + transactionAmount.length.toString().padStart(2, '0') + transactionAmount,
    '5802BR',
    '59' + merchantName.length.toString().padStart(2, '0') + merchantName,
    '60' + merchantCity.length.toString().padStart(2, '0') + merchantCity,
    '62' + (description.length + 4).toString().padStart(2, '0') + '05' + description.length.toString().padStart(2, '0') + description,
    '6304',
  ].join('');

  return payload;
}

export default function PixPayment({ gift, onClose }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const pixCode = generatePixCode(
    weddingConfig.pixKey,
    weddingConfig.pixName,
    weddingConfig.pixCity,
    gift.value,
    gift.name
  );

  useEffect(() => {
    // Generate a simple QR code using a data URL
    // In production, use a proper QR code library
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 200;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = 'black';
      // Simple pattern to simulate QR code
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i * 8, j * 8, 8, 8);
          }
        }
      }
      // Add position markers
      ctx.fillStyle = 'black';
      [[0,0], [17,0], [0,17]].forEach(([x, y]) => {
        ctx.fillRect(x * 8, y * 8, 24, 24);
        ctx.fillStyle = 'white';
        ctx.fillRect(x * 8 + 4, y * 8 + 4, 16, 16);
        ctx.fillStyle = 'black';
        ctx.fillRect(x * 8 + 8, y * 8 + 8, 8, 8);
      });
      setQrDataUrl(canvas.toDataURL());
    }
  }, [gift]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await paymentService.create({
      guest_name: guestName,
      guest_email: guestEmail || undefined,
      gift_id: gift.id,
      gift_name: gift.name,
      amount: gift.value,
      payment_method: 'pix',
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h4 className="font-serif text-xl text-wedding-charcoal">Obrigado!</h4>
        <p className="text-wedding-warmgray mt-2">
          Seu presente foi registrado. Assim que confirmarmos o pagamento, atualizaremos o status.
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 bg-wedding-charcoal text-white rounded-xl hover:bg-wedding-charcoal-light transition-colors"
        >
          Fechar
        </button>
      </motion.div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-wedding-warmgray mb-1">Seu nome completo *</label>
          <input
            required
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-3 border border-wedding-gold/20 rounded-xl focus:outline-none focus:border-wedding-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-wedding-warmgray mb-1">E-mail (opcional)</label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-4 py-3 border border-wedding-gold/20 rounded-xl focus:outline-none focus:border-wedding-gold"
          />
        </div>
        <div className="bg-wedding-cream rounded-xl p-4">
          <p className="text-sm text-wedding-charcoal">
            <strong>Presente:</strong> {gift.name}
          </p>
          <p className="text-sm text-wedding-charcoal">
            <strong>Valor:</strong> R$ {gift.value.toLocaleString('pt-BR')}
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-wedding-charcoal text-white rounded-xl font-medium hover:bg-wedding-charcoal-light transition-colors"
        >
          Confirmar presente
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code PIX" className="w-48 h-48 mx-auto rounded-xl" />
        ) : (
          <div className="w-48 h-48 mx-auto bg-wedding-cream rounded-xl flex items-center justify-center">
            <QrCode size={64} className="text-wedding-gold/40" />
          </div>
        )}
        <p className="text-wedding-warmgray text-sm mt-3">Escaneie com o app do seu banco</p>
      </div>

      <div className="bg-wedding-cream rounded-xl p-4">
        <p className="text-xs text-wedding-warmgray mb-2">Código PIX copia e cola</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={pixCode}
            className="flex-1 px-3 py-2 bg-white border border-wedding-gold/20 rounded-lg text-xs text-wedding-charcoal truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-wedding-charcoal text-white rounded-lg hover:bg-wedding-charcoal-light transition-colors flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-wedding-warmgray text-sm mb-3">
          Após realizar o PIX, confirme o pagamento abaixo.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-wedding-gold text-white rounded-xl font-medium hover:bg-wedding-gold-dark transition-colors"
        >
          Já fiz o PIX
        </button>
      </div>
    </div>
  );
}
