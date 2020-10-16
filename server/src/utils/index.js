function normalizeString(str) {
  if (str == null) return null;

  return str.trim().toLowerCase();
}

module.exports = {
  normalizeString
};
