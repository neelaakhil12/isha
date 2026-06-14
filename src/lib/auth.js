import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

// Persist the OTP store across HMR (Hot Module Replacement) during development
const globalForAuth = globalThis;
if (!globalForAuth.otpStore) {
  globalForAuth.otpStore = new Map();
}
export const otpStore = globalForAuth.otpStore;

/**
 * Generate a cryptographically random-ish 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP in memory with a 5-minute (300000ms) expiry
 */
export function setOTP(email, otp) {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email.toLowerCase(), { otp, expiresAt });
}

/**
 * Verify OTP for a given email
 */
export function verifyOTP(email, otp) {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }

  // Validate OTP code
  if (entry.otp === otp) {
    otpStore.delete(email.toLowerCase()); // Consume OTP on success
    return true;
  }

  return false;
}

/**
 * Sign user session JWT
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify user session JWT
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
