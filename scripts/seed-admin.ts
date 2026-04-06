import { createHash, randomBytes } from 'node:crypto';

const SALT_LENGTH = 16;

function hashPassword(password: string, salt: string): string {
  return createHash('sha512')
    .update(password + salt)
    .digest('hex');
}

const email = 'comprafacil@gmail.com';
const password = 'Comprafacil2025!';
const salt = randomBytes(SALT_LENGTH).toString('hex');
const passwordHash = hashPassword(password, salt);

console.log('=== SQL para insertar usuario admin ===');
console.log('');
console.log(`-- Usuario: ${email}`);
console.log(`-- Password: ${password}`);
console.log('');
console.log(`INSERT INTO admin_users (email, password_hash, salt, role, is_active, created_at)`);
console.log(`VALUES ('${email}', '${passwordHash}', '${salt}', 'admin', 1, datetime('now'));`);
console.log('');
console.log('=== Credenciales de acceso ===');
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
