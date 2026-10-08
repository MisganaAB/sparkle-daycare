const CATEGORIES = [
  'playground',
  'learning_area',
  'classroom',
  'outdoor',
  'activities',
  'events',
  'other',
];

export function validateGalleryCreate({ category, title }) {
  const errors = [];

  if (!category || !CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(', ')}.`);
  }
  if (title && title.length > 200) {
    errors.push('Title must not exceed 200 characters.');
  }

  return errors;
}

export function validateGalleryUpdate(body) {
  const errors = [];

  if (body.category && !CATEGORIES.includes(body.category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(', ')}.`);
  }
  if (body.title && body.title.length > 200) {
    errors.push('Title must not exceed 200 characters.');
  }

  return errors;
}
