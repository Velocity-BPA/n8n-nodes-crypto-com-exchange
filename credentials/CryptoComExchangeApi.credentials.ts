/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class CryptoComExchangeApi implements ICredentialType {
  name = 'cryptoComExchangeApi';
  displayName = 'Crypto.com Exchange API';
  documentationUrl = 'https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Crypto.com Exchange API Key',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Crypto.com Exchange API Secret',
    },
  ];

  // Note: Crypto.com uses custom HMAC-SHA256 authentication
  // The actual authentication is handled in GenericFunctions.ts
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.crypto.com/exchange/v1',
      url: '',
      method: 'POST',
      body: {
        id: Date.now(),
        method: 'public/get-instruments',
        params: {},
        nonce: Date.now(),
      },
      json: true,
    },
  };
}
