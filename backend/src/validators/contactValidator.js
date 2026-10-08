export function validateContact({ name, email, phone, subject, message }) {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }
  if (name && name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters.');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please provide a valid email address.');
  }
  if (email && email.length > 200) {
    errors.push('Email must not exceed 200 characters.');
  }

  if (phone && phone.length > 30) {
    errors.push('Phone must not exceed 30 characters.');
  }

  if (subject && subject.length > 200) {
    errors.push('Subject must not exceed 200 characters.');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  }
  if (message && message.trim().length > 2000) {
    errors.push('Message must not exceed 2000 characters.');
  }

  return errors;
}
