import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function ImageLightbox({ images, index, onClose }) {
  const slides = images.map((img) => ({
    src: img.image_url,
    alt: img.title || 'Gallery photo',
    width: 1600,
    height: 1200,
  }));

  return (
    <Lightbox
      open={index !== null && index >= 0}
      close={onClose}
      slides={slides}
      index={index || 0}
    />
  );
}
