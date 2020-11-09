export { normalizeString, generateToken, shuffle, mapMax };

function normalizeString(str: string): string {
  if (str == null) return null;

  return str.trim().replace(/\s+/g, '');
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

function mapMax(map: Map<any, number>): [any, number] {
  return [...map.entries()].reduce((x, y) => (x[1] > y[1] ? x : y));
}
