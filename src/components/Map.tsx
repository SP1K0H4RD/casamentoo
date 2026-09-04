import { weddingConfig } from '../config/weddingConfig';
import { Navigation, ExternalLink } from 'lucide-react';

export default function Map() {
  // Direct Google Maps embed with pinpoint marker on Espaço Celebre PH / Picos Hotel
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent('Picos Hotel, Av. Senador Helvídio Nunes, 1485, Picos - PI')}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Picos Hotel, Av. Senador Helvídio Nunes, 1485, Picos - PI')}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Picos Hotel, Av. Senador Helvídio Nunes, 1485, Picos - PI')}`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden border border-wedding-gold/20 shadow-md">
        <iframe
          src={mapUrl}
          width="100%"
          height="360"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Localização: ${weddingConfig.venueName}`}
          className="w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-wedding-charcoal text-white rounded-xl font-medium hover:bg-wedding-charcoal-light transition-colors shadow-sm"
        >
          <Navigation size={18} />
          Como chegar (Rotas GPS)
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-wedding-charcoal border border-wedding-gold/30 rounded-xl font-medium hover:bg-wedding-cream transition-colors shadow-sm"
        >
          <ExternalLink size={18} />
          Abrir no Google Maps
        </a>
      </div>
    </div>
  );
}
