const rateLimit = ({ windowMs, max }) => {
  const hits = new Map();
  return async (req) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'global';
    const now = Date.now();
    if (!hits.has(ip)) hits.set(ip, []);
    const timestamps = hits.get(ip).filter(ts => now - ts < windowMs);
    timestamps.push(now);
    hits.set(ip, timestamps);
    if (timestamps.length > max) {
      return { success: false };
    }
    return { success: true };
  };
};
export default rateLimit;
