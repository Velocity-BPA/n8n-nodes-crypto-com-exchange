/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';
import { API_BASE_URL } from '../constants/constants';
import type { ICryptoComRequest, ICryptoComResponse } from '../types/CryptoComTypes';
import { getErrorMessage } from '../types/CryptoComTypes';

// License notice - logged once per node load
let licenseNoticeLogged = false;

function logLicenseNotice(): void {
  if (!licenseNoticeLogged) {
    console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
    licenseNoticeLogged = true;
  }
}

/**
 * Sort object keys alphabetically and convert to string for signature
 */
function sortAndStringifyParams(params: IDataObject): string {
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

/**
 * Generate HMAC-SHA256 signature for Crypto.com API
 */
function signRequest(
  method: string,
  requestId: number,
  apiKey: string,
  params: IDataObject,
  nonce: number,
  secret: string,
): string {
  const paramString = sortAndStringifyParams(params);
  const sigPayload = method + requestId + apiKey + paramString + nonce;

  return crypto.createHmac('sha256', secret).update(sigPayload).digest('hex');
}

/**
 * Make an authenticated request to Crypto.com Exchange API
 */
export async function cryptoComApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  params: IDataObject = {},
  isPublic = false,
): Promise<IDataObject> {
  // Log license notice on first use
  logLicenseNotice();

  const requestId = Date.now();
  const nonce = Date.now();

  const body: ICryptoComRequest = {
    id: requestId,
    method,
    nonce,
  };

  // Add params if not empty
  if (Object.keys(params).length > 0) {
    body.params = params;
  }

  // Add authentication for private endpoints
  if (!isPublic) {
    const credentials = await this.getCredentials('cryptoComExchangeApi');
    const apiKey = credentials.apiKey as string;
    const apiSecret = credentials.apiSecret as string;

    body.api_key = apiKey;
    body.sig = signRequest(method, requestId, apiKey, params, nonce, apiSecret);
  }

  const options: IHttpRequestOptions = {
    method: 'POST' as IHttpRequestMethods,
    url: API_BASE_URL,
    body,
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = (await this.helpers.httpRequest(options)) as ICryptoComResponse;

    // Check for API errors
    if (response.code !== 0) {
      const errorMessage = response.message || getErrorMessage(response.code);
      throw new NodeApiError(
        this.getNode(),
        {} as unknown as JsonObject,
        {
          message: `Crypto.com API Error: ${errorMessage}`,
          description: `Error code: ${response.code}`,
        }
      );
    }

    return response.result || {};
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }
    throw new NodeApiError(
      this.getNode(),
      {} as unknown as JsonObject,
      { message: (error as Error).message }
    );
  }
}

/**
 * Make a paginated request to Crypto.com Exchange API
 */
export async function cryptoComApiRequestAllItems(
  this: IExecuteFunctions,
  method: string,
  params: IDataObject = {},
  resultKey: string,
  isPublic = false,
  limit = 200,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const requestParams = {
      ...params,
      page,
      page_size: limit,
    };

    const response = await cryptoComApiRequest.call(this, method, requestParams, isPublic);

    const items = (response[resultKey] as IDataObject[]) || [];
    returnData.push(...items);

    // Check if there are more items
    if (items.length < limit) {
      hasMore = false;
    } else {
      page++;
    }

    // Safety limit to prevent infinite loops
    if (page > 100) {
      hasMore = false;
    }
  }

  return returnData;
}

/**
 * Clean empty parameters from object
 */
export function cleanParams(params: IDataObject): IDataObject {
  const cleaned: IDataObject = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Convert timestamp to milliseconds if needed
 */
export function toTimestampMs(value: string | number | Date): number {
  if (typeof value === 'number') {
    // If less than 13 digits, assume seconds and convert to ms
    return value < 10000000000 ? value * 1000 : value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  // Try to parse string
  const parsed = Date.parse(value);
  if (!isNaN(parsed)) {
    return parsed;
  }
  // Try as numeric string
  const numeric = parseInt(value, 10);
  if (!isNaN(numeric)) {
    return numeric < 10000000000 ? numeric * 1000 : numeric;
  }
  throw new Error(`Invalid timestamp value: ${value}`);
}

/**
 * Validate instrument name format (e.g., BTC_USDT)
 */
export function validateInstrumentName(instrumentName: string): boolean {
  const pattern = /^[A-Z0-9]+_[A-Z0-9]+$/;
  return pattern.test(instrumentName);
}

/**
 * Format number for API (string with appropriate precision)
 */
export function formatNumber(value: number | string, precision = 8): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toFixed(precision).replace(/\.?0+$/, '');
}
