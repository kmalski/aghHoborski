function normalizeString(str) {
  if (str == null) return null;

  return str.trim().toLowerCase();
}

function rand() {
  return Math.random().toString(36).substr(2);
}

function generateToken() {
  return rand() + rand();
}

module.exports = {
  normalizeString,
  generateToken
};
