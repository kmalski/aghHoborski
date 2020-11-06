export { normalizeString, generateToken, shuffle };

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

function shuffle(array: any[]) {
  // Durstenfeld shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
