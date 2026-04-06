import { createHash, randomBytes } from 'node:crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = 'sha512';

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = createHash(DIGEST)
    .update(password + salt)
    .digest('hex');
  
  return {
    hash: hash,
    salt: salt
  };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = createHash(DIGEST)
    .update(password + salt)
    .digest('hex');
  
  return hash === verifyHash;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export interface SessionData {
  userId: number;
  email: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

export function createSessionData(userId: number, email: string, role: string, maxAge: number = 86400): SessionData {
  const now = Date.now();
  return {
    userId,
    email,
    role,
    createdAt: now,
    expiresAt: now + (maxAge * 1000)
  };
}

export function isSessionValid(session: SessionData): boolean {
  return session.expiresAt > Date.now();
}

export function serializeSession(session: SessionData): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

export function deserializeSession(serialized: string): SessionData | null {
  try {
    const data = JSON.parse(Buffer.from(serialized, 'base64').toString('utf8'));
    return data as SessionData;
  } catch {
    return null;
  }
}
