/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CryptocomExchange } from '../nodes/Crypto.com Exchange/Crypto.com Exchange.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CryptocomExchange Node', () => {
  let node: CryptocomExchange;

  beforeAll(() => {
    node = new CryptocomExchange();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Crypto.com Exchange');
      expect(node.description.name).toBe('cryptocomexchange');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secretKey: 'test-secret-key',
        baseUrl: 'https://api.crypto.com/exchange/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Crypto.com Exchange Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getAccountSummary operation', () => {
    it('should successfully get account summary', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountSummary');
      const mockResponse = {
        id: 123,
        method: 'private/get-account-summary',
        code: 0,
        result: {
          accounts: [
            {
              balance: '1000.0',
              available: '950.0',
              order: '50.0',
              stake: '0.0',
              currency: 'USDT'
            }
          ]
        }
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.crypto.com/exchange/v1/private/get-account-summary',
        })
      );
    });

    it('should handle errors when getting account summary', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountSummary');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getAccountInfo operation', () => {
    it('should successfully get account info', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountInfo');
      const mockResponse = {
        id: 123,
        method: 'private/get-account-info',
        code: 0,
        result: {
          email: 'user@example.com',
          email_verified: true,
          two_fa_enabled: true,
          kyc_level: 'VERIFIED'
        }
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.crypto.com/exchange/v1/private/get-account-info',
        })
      );
    });

    it('should handle errors when getting account info', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountInfo');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Authentication failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Authentication failed');
    });
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        secretKey: 'test-secret',
        baseUrl: 'https://api.crypto.com/exchange/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should create order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createOrder';
        case 'instrument_name': return 'BTC_USDT';
        case 'side': return 'BUY';
        case 'type': return 'LIMIT';
        case 'quantity': return '0.001';
        case 'price': return '50000';
        default: return '';
      }
    });

    const mockResponse = { result: { order_id: '12345', status: 'ACTIVE' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'cancelOrder';
        case 'instrument_name': return 'BTC_USDT';
        case 'order_id': return '12345';
        default: return '';
      }
    });

    const mockResponse = { result: { order_id: '12345', status: 'CANCELLED' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createOrder';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get order history successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getOrderHistory';
        case 'instrument_name': return 'BTC_USDT';
        case 'page_size': return 20;
        case 'page': return 0;
        default: return 0;
      }
    });

    const mockResponse = { result: { order_list: [{ order_id: '12345', status: 'FILLED' }] } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });
});

describe('Trade Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secretKey: 'test-secret-key',
        baseUrl: 'https://api.crypto.com/exchange/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('getTrades operation', () => {
    it('should get trades successfully', async () => {
      const mockResponse = {
        id: 1234567890,
        method: 'private/get-trades',
        code: 0,
        result: {
          data: [
            {
              trade_id: '123456',
              instrument_name: 'BTC_USDT',
              side: 'BUY',
              quantity: '0.1',
              price: '50000.00',
              fee: '5.00',
              create_time: 1634567890000
            }
          ]
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrades')
        .mockReturnValueOnce('BTC_USDT')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(200)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.crypto.com/exchange/v1/private/get-trades',
          headers: expect.objectContaining({
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API request failed');
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrades')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(200)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('API request failed');
    });

    it('should continue on fail when configured', async () => {
      const mockError = new Error('API request failed');
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTrades')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(200)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTradeOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API request failed' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Market Data Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.crypto.com/exchange/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get instruments successfully', async () => {
    const mockResponse = { result: { data: [{ instrument_name: 'BTC_USDT' }] } };
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getInstruments');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.crypto.com/exchange/v1/public/get-instruments',
      headers: { 'Content-Type': 'application/json' },
      json: true,
    });
  });

  it('should get order book successfully', async () => {
    const mockResponse = { result: { data: { bids: [], asks: [] } } };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrderBook')
      .mockReturnValueOnce('BTC_USDT')
      .mockReturnValueOnce(50);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get ticker successfully', async () => {
    const mockResponse = { result: { data: { a: '50000', b: '49999' } } };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTicker')
      .mockReturnValueOnce('BTC_USDT');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get all tickers successfully', async () => {
    const mockResponse = { result: { data: [{ i: 'BTC_USDT', a: '50000' }] } };
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllTickers');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get candlestick data successfully', async () => {
    const mockResponse = { result: { data: [[1640995200000, 47000, 48000, 46000, 47500, 100]] } };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCandlestick')
      .mockReturnValueOnce('BTC_USDT')
      .mockReturnValueOnce('1h')
      .mockReturnValueOnce(1640995200000)
      .mockReturnValueOnce(1641081600000);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getInstruments');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeMarketDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(
      executeMarketDataOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Position Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.crypto.com/exchange/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get positions successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getPositions';
      if (param === 'instrumentName') return 'BTC-USD';
      return '';
    });

    const mockResponse = {
      result: {
        data: [
          {
            instrument_name: 'BTC-USD',
            quantity: '1.5',
            cost: '45000.00'
          }
        ]
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executePositionOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.crypto.com/exchange/v1/private/get-positions'
      })
    );
  });

  test('should get position history successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getPositionHistory';
      if (param === 'instrumentName') return 'BTC-USD';
      if (param === 'startTs') return 1640995200000;
      if (param === 'endTs') return 1641081600000;
      if (param === 'pageSize') return 20;
      if (param === 'page') return 0;
      return '';
    });

    const mockResponse = {
      result: {
        data: [
          {
            instrument_name: 'BTC-USD',
            quantity: '1.0',
            timestamp: 1640995300000
          }
        ]
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executePositionOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.crypto.com/exchange/v1/private/get-position-history'
      })
    );
  });

  test('should handle API errors properly', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getPositions');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];

    await expect(
      executePositionOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('API Error');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getPositions');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executePositionOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    const items = [{ json: {} }];

    await expect(
      executePositionOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
