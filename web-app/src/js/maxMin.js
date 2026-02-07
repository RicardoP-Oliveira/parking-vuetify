
export function dateFormatterOutput(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date)) return null;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function normalizeText(v) {
  if (typeof v !== 'string') return null;

  const value = v.trim();
  return value.length ? value : null;
}

