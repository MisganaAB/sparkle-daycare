import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';

export default function GalleryGrid({ images, onImageClick }) {
  if (!images.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-4xl mb-3">📷</div>
        <p>No photos in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image, idx) => (
        <button
          key={image.id}
          onClick={() => onImageClick?.(idx)}
          className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label={`View ${image.title || 'gallery photo'}`}
        >
          <LazyImage
            src={image.thumb_url || image.image_url}
            alt={image.title || 'Gallery photo'}
            className="w-full h-full"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-end">
            {image.title && (
              <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <p className="text-white text-sm font-medium truncate">{image.title}</p>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
