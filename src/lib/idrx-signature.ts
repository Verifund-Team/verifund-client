import * as crypto from 'crypto';

function atob(str: string) {
  return Buffer.from(str, 'base64').toString('binary');
}

export function createSignature(
  method: string,
  url: string,
  body: Record<string, unknown> | null,
  timestamp: string,
  secretKey: string,
) {
  const bodyBuffer = body ? Buffer.from(JSON.stringify(body)) : Buffer.alloc(0);
  const secret = atob(secretKey);

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(timestamp);
  hmac.update(method);
  hmac.update(url);

  if (bodyBuffer.length > 0) {
    hmac.update(bodyBuffer);
  }

  const hash = hmac.digest();
  const signature = hash.toString('base64url');

  return signature;
}

export function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}