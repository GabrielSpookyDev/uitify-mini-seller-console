// src/lib/id.ts

/** Generate a RFC4122 v4 UUID using the best available source. */
export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  const randomBytes = (length = 16): Uint8Array => {
    const buffer = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < length; i++) buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  };

  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

  const toHex = (num: number) => num.toString(16).padStart(2, '0');
  const hexString = Array.from(bytes, toHex).join('');

  return (
    hexString.slice(0, 8) +
    '-' +
    hexString.slice(8, 12) +
    '-' +
    hexString.slice(12, 16) +
    '-' +
    hexString.slice(16, 20) +
    '-' +
    hexString.slice(20, 32)
  );
}
