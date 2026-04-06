const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const ITERATIONS = 100000;

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToArrayBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function getRandomValues(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = getRandomValues(SALT_LENGTH);
  const saltHex = arrayBufferToHex(salt.buffer);
  
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-512'
    },
    keyMaterial,
    KEY_LENGTH * 8
  );
  
  const hashHex = arrayBufferToHex(derivedBits);
  
  return {
    hash: hashHex,
    salt: saltHex
  };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const saltBytes = hexToArrayBuffer(salt);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: ITERATIONS,
      hash: 'SHA-512'
    },
    keyMaterial,
    KEY_LENGTH * 8
  );
  
  const hashHex = arrayBufferToHex(derivedBits);
  return hash === hashHex;
}

export function generateSessionToken(): string {
  return arrayBufferToHex(crypto.getRandomValues(32).buffer);
}

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(token));
  return arrayBufferToHex(hashBuffer);
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
  return btoa(JSON.stringify(session));
}

export function deserializeSession(serialized: string): SessionData | null {
  try {
    const data = JSON.parse(atob(serialized));
    return data as SessionData;
  } catch {
    return null;
  }
}