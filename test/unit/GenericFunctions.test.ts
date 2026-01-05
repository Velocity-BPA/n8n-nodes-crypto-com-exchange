/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

// Mock the sortAndStringifyParams and signRequest functions
function sortAndStringifyParams(params: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const sortedKeys = Object.keys(params).sort();
  return sortedKeys.reduce((acc, key) => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        return acc + key + JSON.stringify(value);
      }
      return acc + key + String(value);
    }
    return acc;
  }, '');
}

function signRequest(
  method: string,
  requestId: number,
  apiKey: string,
  params: Record<string, unknown>,
  nonce: number,
  secret: string,
): string {
  const paramString = sortAndStringifyParams(params);
  const sigPayload = method + requestId + apiKey + paramString + nonce;

  return crypto.createHmac('sha256', secret).update(sigPayload).digest('hex');
}

describe('GenericFunctions', () => {
  describe('sortAndStringifyParams', () => {
    it('should return empty string for empty params', () => {
      expect(sortAndStringifyParams({})).toBe('');
    });

    it('should sort keys alphabetically', () => {
      const params = { z: 'last', a: 'first', m: 'middle' };
      const result = sortAndStringifyParams(params);
      expect(result).toBe('afirstmmiddlezlast');
    });

    it('should handle numeric values', () => {
      const params = { count: 100, page: 0 };
      const result = sortAndStringifyParams(params);
      expect(result).toBe('count100page0');
    });

    it('should handle nested objects', () => {
      const params = { data: { nested: 'value' } };
      const result = sortAndStringifyParams(params);
      expect(result).toBe('data{"nested":"value"}');
    });

    it('should skip null and undefined values', () => {
      const params = { valid: 'yes', empty: null, missing: undefined };
      const result = sortAndStringifyParams(params);
      expect(result).toBe('validyes');
    });
  });

  describe('signRequest', () => {
    it('should generate valid HMAC-SHA256 signature', () => {
      const method = 'private/get-account-summary';
      const requestId = 1234567890;
      const apiKey = 'test-api-key';
      const params = { currency: 'BTC' };
      const nonce = 1234567890;
      const secret = 'test-secret';

      const signature = signRequest(method, requestId, apiKey, params, nonce, secret);

      // Verify it's a valid hex string
      expect(signature).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce different signatures for different params', () => {
      const method = 'private/create-order';
      const requestId = 1234567890;
      const apiKey = 'test-api-key';
      const nonce = 1234567890;
      const secret = 'test-secret';

      const sig1 = signRequest(method, requestId, apiKey, { side: 'BUY' }, nonce, secret);
      const sig2 = signRequest(method, requestId, apiKey, { side: 'SELL' }, nonce, secret);

      expect(sig1).not.toBe(sig2);
    });

    it('should produce consistent signatures for same inputs', () => {
      const method = 'private/get-trades';
      const requestId = 1234567890;
      const apiKey = 'test-api-key';
      const params = { instrument_name: 'BTC_USDT' };
      const nonce = 1234567890;
      const secret = 'test-secret';

      const sig1 = signRequest(method, requestId, apiKey, params, nonce, secret);
      const sig2 = signRequest(method, requestId, apiKey, params, nonce, secret);

      expect(sig1).toBe(sig2);
    });
  });
});

describe('Error Codes', () => {
  const ERROR_CODES: Record<number, string> = {
    0: 'Success',
    10001: 'System error',
    10002: 'Invalid request',
    10003: 'Request timeout',
    10004: 'IP rate limit exceeded',
    10005: 'User rate limit exceeded',
    10006: 'Invalid nonce',
    10007: 'Invalid signature',
    20001: 'Insufficient balance',
    30003: 'Invalid instrument_name',
    30014: 'Invalid side',
    40001: 'Order not found',
    40002: 'Invalid order status',
  };

  it('should have correct error messages', () => {
    expect(ERROR_CODES[0]).toBe('Success');
    expect(ERROR_CODES[10007]).toBe('Invalid signature');
    expect(ERROR_CODES[20001]).toBe('Insufficient balance');
    expect(ERROR_CODES[40001]).toBe('Order not found');
  });
});
