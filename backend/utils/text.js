export const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

export const isHttpUrl = (value) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
