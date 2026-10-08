const DAY_ICONS = {
  Monday: '🎨',
  Tuesday: '⚽',
  Wednesday: '📖',
  Thursday: '🎵',
  Friday: '🧩',
  Saturday: '🌞',
  Sunday: '🌈',
};

const DAY_COLORS = {
  Monday: 'bg-rose-50 border-rose-100',
  Tuesday: 'bg-sky-50 border-sky-100',
  Wednesday: 'bg-amber-50 border-amber-100',
  Thursday: 'bg-violet-50 border-violet-100',
  Friday: 'bg-emerald-50 border-emerald-100',
  Saturday: 'bg-orange-50 border-orange-100',
  Sunday: 'bg-pink-50 border-pink-100',
};

export default function ProgramCard({ activity }) {
  const { day, title, description, image_url } = activity;
  const icon = DAY_ICONS[day] || '📅';
  const colorClass = DAY_COLORS[day] || 'bg-gray-50 border-gray-100';

  return (
    <div className={`rounded-2xl border p-5 flex gap-4 ${colorClass}`}>
      <div className="text-3xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{day}</div>
        <h3 className="font-bold text-gray-800 text-base mb-1">{title}</h3>
        {description && <p className="text-sm text-gray-600 leading-relaxed">{description}</p>}
      </div>
      {image_url && (
        <img
          src={image_url}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-16 h-16 rounded-xl object-cover shrink-0"
        />
      )}
    </div>
  );
}
