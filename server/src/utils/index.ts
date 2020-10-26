export { normalizeString, generateToken };

function normalizeString(str: string): string {
  if (str == null) return null;

  return str.trim().toLowerCase();
}

function rand(): string {
  return Math.random().toString(36).substr(2);
}

function generateToken(): string {
  return rand() + rand();
}
