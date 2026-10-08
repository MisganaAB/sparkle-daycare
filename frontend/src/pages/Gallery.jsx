import { useState } from 'react';
import { useGallery } from '../hooks/useGallery';
import SectionHeader from '../components/SectionHeader';
import GalleryGrid from '../components/GalleryGrid';
import ImageLightbox from '../components/ImageLightbox';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'playground', label: 'Playground' },
  { value: 'learning_area', label: 'Learning Area' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'activities', label: 'Activities' },
  { value: 'events', label: 'Events' },
];

export default function Gallery() {
  const [category, setCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { images, pagination, loading, loadingMore, error, loadMore } = useGallery({ category });

  return (
    <main className="pt-16">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Gallery"
            title="Our Environment"
            subtitle="Explore our spaces, activities, and the joy of learning through play."
          />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Gallery categories">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={category === value}
                onClick={() => setCategory(value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message="Failed to load gallery." />}

          {!loading && !error && (
            <GalleryGrid images={images} onImageClick={setLightboxIndex} />
          )}

          {/* Load More */}
          {!loading && pagination.page < pagination.pages && (
            <div className="text-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {loadingMore ? 'Loading…' : 'Load More'}
              </button>
            </div>
          )}

          {/* Results count */}
          {!loading && images.length > 0 && (
            <p className="text-center text-sm text-gray-400 mt-6">
              Showing {images.length} of {pagination.total} photos
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </main>
  );
}
