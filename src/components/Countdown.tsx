import { useCountdown } from '../hooks/useCountdown';

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="font-serif text-2xl text-wedding-gold">É hoje! 💍</p>
      </div>
    );
  }

  const units = [
    { value: days, label: 'dias' },
    { value: hours, label: 'horas' },
    { value: minutes, label: 'minutos' },
    { value: seconds, label: 'segundos' },
  ];

  return (
    <div className="text-center">
      <p className="text-wedding-warmgray text-xs tracking-[0.3em] uppercase mb-4">Faltam</p>
      <div className="flex justify-center gap-3 md:gap-6">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-sm border border-wedding-gold/10 flex items-center justify-center">
              <span className="font-serif text-2xl md:text-3xl text-wedding-charcoal tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-wedding-warmgray text-xs tracking-wide capitalize">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
