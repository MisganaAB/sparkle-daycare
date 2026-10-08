import LazyImage from './LazyImage';

export default function FacilityCard({ title, description, image, icon }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
      <div className="aspect-video overflow-hidden">
        {image ? (
          <LazyImage src={image} alt={title} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-5xl">
            {icon}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
