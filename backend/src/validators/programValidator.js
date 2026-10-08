export function validateProgram({ title, week_start, week_end }) {
  const errors = [];

  if (!title || title.trim().length < 2) {
    errors.push('Title is required.');
  }
  if (!week_start) {
    errors.push('Week start date is required.');
  }
  if (!week_end) {
    errors.push('Week end date is required.');
  }
  if (week_start && week_end && new Date(week_start) > new Date(week_end)) {
    errors.push('Week start must be before week end.');
  }

  return errors;
}

export function validateActivity({ weekly_program_id, day, title }) {
  const errors = [];
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (!weekly_program_id) errors.push('weekly_program_id is required.');
  if (!day || !DAYS.includes(day)) {
    errors.push(`Day must be one of: ${DAYS.join(', ')}.`);
  }
  if (!title || title.trim().length < 2) {
    errors.push('Activity title is required.');
  }

  return errors;
}
