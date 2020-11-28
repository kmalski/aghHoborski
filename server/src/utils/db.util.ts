export { withDatabase };

function withDatabase(): boolean {
  return process.env.MONGODB_URI != null;
}
