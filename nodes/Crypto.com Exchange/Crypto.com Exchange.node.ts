/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-cryptocomexchange/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import { createHmac } from 'crypto';

export class CryptocomExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Crypto.com Exchange',
    name: 'cryptocomexchange',
    icon: 'file:cryptocomexchange.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Crypto.com Exchange API',
    defaults: {
      name: 'Crypto.com Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'cryptocomexchangeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Trade',
            value: 'trade',
          },
          {
            name: 'Market Data',
            value: 'marketData',
          },
          {
            name: 'Position',
            value: 'position',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    {
      name: 'Get Account Summary',
      value: 'getAccountSummary',
      description: 'Get account summary with balances',
      action: 'Get account summary'
    },
    {
      name: 'Get Account Info',
      value: 'getAccountInfo',
      description: 'Get detailed account information',
      action: 'Get account info'
    }
  ],
  default: 'getAccountSummary',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Create Order', value: 'createOrder', description: 'Create a new order', action: 'Create order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel an existing order', action: 'Cancel order' },
    { name: 'Cancel All Orders', value: 'cancelAllOrders', description: 'Cancel all open orders', action: 'Cancel all orders' },
    { name: 'Get Order History', value: 'getOrderHistory', description: 'Get order history', action: 'Get order history' },
    { name: 'Get Order Detail', value: 'getOrderDetail', description: 'Get specific order details', action: 'Get order detail' },
    { name: 'Get Open Orders', value: 'getOpenOrders', description: 'Get all open orders', action: 'Get open orders' },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['trade'] } },
  options: [
    {
      name: 'Get Trades',
      value: 'getTrades',
      description: 'Get trade history',
      action: 'Get trade history'
    }
  ],
  default: 'getTrades',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['marketData'],
    },
  },
  options: [
    {
      name: 'Get Instruments',
      value: 'getInstruments',
      description: 'Get list of available trading instruments',
      action: 'Get instruments',
    },
    {
      name: 'Get Order Book',
      value: 'getOrderBook',
      description: 'Get order book for an instrument',
      action: 'Get order book',
    },
    {
      name: 'Get Ticker',
      value: 'getTicker',
      description: 'Get ticker information for a specific instrument',
      action: 'Get ticker',
    },
    {
      name: 'Get All Tickers',
      value: 'getAllTickers',
      description: 'Get ticker information for all instruments',
      action: 'Get all tickers',
    },
    {
      name: 'Get Candlestick',
      value: 'getCandlestick',
      description: 'Get candlestick/OHLC data for an instrument',
      action: 'Get candlestick data',
    },
  ],
  default: 'getInstruments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['position'] } },
  options: [
    { name: 'Get Positions', value: 'getPositions', description: 'Get current positions', action: 'Get current positions' },
    { name: 'Get Position History', value: 'getPositionHistory', description: 'Get position history', action: 'Get position history' }
  ],
  default: 'getPositions',
},
{
  displayName: 'Instrument Name',
  name: 'instrument_name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'cancelOrder', 'cancelAllOrders', 'getOrderHistory', 'getOpenOrders'] } },
  default: '',
  description: 'The trading pair symbol (e.g., BTC_USDT)',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Buy', value: 'BUY' },
    { name: 'Sell', value: 'SELL' },
  ],
  default: 'BUY',
  description: 'Order side',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Limit', value: 'LIMIT' },
    { name: 'Market', value: 'MARKET' },
    { name: 'Stop Loss', value: 'STOP_LOSS' },
    { name: 'Stop Limit', value: 'STOP_LIMIT' },
    { name: 'Take Profit', value: 'TAKE_PROFIT' },
    { name: 'Take Profit Limit', value: 'TAKE_PROFIT_LIMIT' },
  ],
  default: 'LIMIT',
  description: 'Order type',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Order quantity',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Order price (required for limit orders)',
},
{
  displayName: 'Client Order ID',
  name: 'client_oid',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Client-specified order ID',
},
{
  displayName: 'Time in Force',
  name: 'time_in_force',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Good Till Cancel', value: 'GTC' },
    { name: 'Fill or Kill', value: 'FOK' },
    { name: 'Immediate or Cancel', value: 'IOC' },
  ],
  default: 'GTC',
  description: 'Time in force',
},
{
  displayName: 'Execution Instruction',
  name: 'exec_inst',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Post Only', value: 'POST_ONLY' },
    { name: 'Reduce Only', value: 'REDUCE_ONLY' },
  ],
  default: '',
  description: 'Execution instruction',
},
{
  displayName: 'Order ID',
  name: 'order_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['cancelOrder', 'getOrderDetail'] } },
  default: '',
  description: 'The order ID to cancel or get details for',
},
{
  displayName: 'Start Timestamp',
  name: 'start_ts',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrderHistory'] } },
  default: 0,
  description: 'Start timestamp for order history',
},
{
  displayName: 'End Timestamp',
  name: 'end_ts',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrderHistory'] } },
  default: 0,
  description: 'End timestamp for order history',
},
{
  displayName: 'Page Size',
  name: 'page_size',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrderHistory', 'getOpenOrders'] } },
  default: 20,
  description: 'Number of records per page',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrderHistory', 'getOpenOrders'] } },
  default: 0,
  description: 'Page number',
},
{
  displayName: 'Instrument Name',
  name: 'instrumentName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['trade'],
      operation: ['getTrades']
    }
  },
  default: '',
  description: 'Trading pair symbol (e.g., BTC_USDT). Leave empty for all instruments.'
},
{
  displayName: 'Start Timestamp',
  name: 'startTs',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['trade'],
      operation: ['getTrades']
    }
  },
  default: 0,
  description: 'Start time in Unix timestamp (milliseconds). 0 for no start time filter.'
},
{
  displayName: 'End Timestamp',
  name: 'endTs',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['trade'],
      operation: ['getTrades']
    }
  },
  default: 0,
  description: 'End time in Unix timestamp (milliseconds). 0 for no end time filter.'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['trade'],
      operation: ['getTrades']
    }
  },
  default: 200,
  description: 'Number of trades to return per page (max 200)'
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['trade'],
      operation: ['getTrades']
    }
  },
  default: 0,
  description: 'Page number (0-indexed)'
},
{
  displayName: 'Instrument Name',
  name: 'instrumentName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getOrderBook', 'getTicker', 'getCandlestick'],
    },
  },
  default: '',
  placeholder: 'BTC_USDT',
  description: 'The name of the trading instrument (e.g., BTC_USDT)',
},
{
  displayName: 'Depth',
  name: 'depth',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getOrderBook'],
    },
  },
  default: 50,
  description: 'Number of bids and asks to retrieve (max 150)',
},
{
  displayName: 'Timeframe',
  name: 'timeframe',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getCandlestick'],
    },
  },
  options: [
    { name: '1 Minute', value: '1m' },
    { name: '5 Minutes', value: '5m' },
    { name: '15 Minutes', value: '15m' },
    { name: '30 Minutes', value: '30m' },
    { name: '1 Hour', value: '1h' },
    { name: '4 Hours', value: '4h' },
    { name: '6 Hours', value: '6h' },
    { name: '12 Hours', value: '12h' },
    { name: '1 Day', value: '1D' },
    { name: '7 Days', value: '7D' },
    { name: '14 Days', value: '14D' },
    { name: '1 Month', value: '1M' },
  ],
  default: '1h',
  description: 'The timeframe for candlestick data',
},
{
  displayName: 'Start Timestamp',
  name: 'startTs',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getCandlestick'],
    },
  },
  default: '',
  description: 'Start timestamp in milliseconds (optional)',
},
{
  displayName: 'End Timestamp',
  name: 'endTs',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getCandlestick'],
    },
  },
  default: '',
  description: 'End timestamp in milliseconds (optional)',
},
{
  displayName: 'Instrument Name',
  name: 'instrumentName',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['position'], operation: ['getPositions'] } },
  default: '',
  description: 'The instrument name to get positions for',
},
{
  displayName: 'Instrument Name',
  name: 'instrumentName',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['position'], operation: ['getPositionHistory'] } },
  default: '',
  description: 'The instrument name to get position history for',
},
{
  displayName: 'Start Timestamp',
  name: 'startTs',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['position'], operation: ['getPositionHistory'] } },
  default: 0,
  description: 'Start timestamp for position history',
},
{
  displayName: 'End Timestamp',
  name: 'endTs',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['position'], operation: ['getPositionHistory'] } },
  default: 0,
  description: 'End timestamp for position history',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['position'], operation: ['getPositionHistory'] } },
  default: 50,
  description: 'Number of records per page',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['position'], operation: ['getPositionHistory'] } },
  default: 0,
  description: 'Page number to retrieve',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'trade':
        return [await executeTradeOperations.call(this, items)];
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'position':
        return [await executePositionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('cryptocomexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const nonce = Date.now();
      let method: string = '';
      let params: any = { nonce, method };
      
      // Sort parameters alphabetically for signature
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      
      // Create HMAC-SHA256 signature
      const signature = crypto
        .createHmac('sha256', credentials.secretKey)
        .update(sortedParams)
        .digest('hex');

      switch (operation) {
        case 'getAccountSummary': {
          method = 'private/get-account-summary';
          params = { nonce, method };
          
          const sortedParamsForSummary = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
          
          const summarySignature = crypto
            .createHmac('sha256', credentials.secretKey)
            .update(sortedParamsForSummary)
            .digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.crypto.com/exchange/v1'}/private/get-account-summary`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              id: Math.floor(Math.random() * 1000000),
              method: 'private/get-account-summary',
              api_key: credentials.apiKey,
              params: params,
              sig: summarySignature,
              nonce: nonce,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAccountInfo': {
          method = 'private/get-account-info';
          params = { nonce, method };
          
          const sortedParamsForInfo = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
          
          const infoSignature = crypto
            .createHmac('sha256', credentials.secretKey)
            .update(sortedParamsForInfo)
            .digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.crypto.com/exchange/v1'}/private/get-account-info`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              id: Math.floor(Math.random() * 1000000),
              method: 'private/get-account-info',
              api_key: credentials.apiKey,
              params: params,
              sig: infoSignature,
              nonce: nonce,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i }
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('cryptocomexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now();

      switch (operation) {
        case 'createOrder': {
          const params: any = {
            instrument_name: this.getNodeParameter('instrument_name', i) as string,
            side: this.getNodeParameter('side', i) as string,
            type: this.getNodeParameter('type', i) as string,
            quantity: this.getNodeParameter('quantity', i) as string,
          };

          const price = this.getNodeParameter('price', i) as string;
          if (price) params.price = price;

          const client_oid = this.getNodeParameter('client_oid', i) as string;
          if (client_oid) params.client_oid = client_oid;

          const time_in_force = this.getNodeParameter('time_in_force', i) as string;
          if (time_in_force) params.time_in_force = time_in_force;

          const exec_inst = this.getNodeParameter('exec_inst', i) as string;
          if (exec_inst) params.exec_inst = exec_inst;

          const requestData = {
            id: nonce,
            method: 'private/create-order',
            api_key: credentials.apiKey,
            params: params,
            nonce: nonce,
          };

          const sortedParams = Object.keys(requestData).sort().reduce((sorted: any, key: string) => {
            sorted[key] = (requestData as any)[key];
            return sorted;
          }, {});

          const paramString = Object.keys(sortedParams).map(key => `${key}=${JSON.stringify((sortedParams as any)[key])}`).join('&');
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(paramString).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/create-order`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestData, sig: signature }),
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'cancelOrder': {
          const params: any = {
            instrument_name: this.getNodeParameter('instrument_name', i) as string,
            order_id: this.getNodeParameter('order_id', i) as string,
          };

          const requestData = {
            id: nonce,
            method: 'private/cancel-order',
            api_key: credentials.apiKey,
            params: params,
            nonce: nonce,
          };

          const sortedParams = Object.keys(requestData).sort().reduce((sorted: any, key: string) => {
            sorted[key] = (requestData as any)[key];
            return sorted;
          }, {});

          const paramString = Object.keys(sortedParams).map(key => `${key}=${JSON.stringify((sortedParams as any)[key])}`).join('&');
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(paramString).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/cancel-order`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestData, sig: signature }),
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'cancelAllOrders': {
          const params: any = {
            instrument_name: this.getNodeParameter('instrument_name', i) as string,
          };

          const requestData = {
            id: nonce,
            method: 'private/cancel-all-orders',
            api_key: credentials.apiKey,
            params: params,
            nonce: nonce,
          };

          const sortedParams = Object.keys(requestData).sort().reduce((sorted: any, key: string) => {
            sorted[key] = (requestData as any)[key];
            return sorted;
          }, {});

          const paramString = Object.keys(sortedParams).map(key => `${key}=${JSON.stringify((sortedParams as any)[key])}`).join('&');
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(paramString).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/cancel-all-orders`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestData, sig: signature }),
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getOrderHistory': {
          const params: any = {
            instrument_name: this.getNodeParameter('instrument_name', i) as string,
          };

          const start_ts = this.getNodeParameter('start_ts', i) as number;
          if (start_ts) params.start_ts = start_ts;

          const end_ts = this.getNodeParameter('end_ts', i) as number;
          if (end_ts) params.end_ts = end_ts;

          const page_size = this.getNodeParameter('page_size', i) as number;
          if (page_size) params.page_size = page_size;

          const page = this.getNodeParameter('page', i) as number;
          if (page) params.page = page;

          const requestData = {
            id: nonce,
            method: 'private/get-order-history',
            api_key: credentials.apiKey,
            params: params,
            nonce: nonce,
          };

          const sortedParams = Object.keys(requestData).sort().reduce((sorted: any, key: string) => {
            sorted[key] = (requestData as any)[key];
            return sorted;
          }, {});

          const paramString = Object.keys(sortedParams).map(key => `${key}=${JSON.stringify((sortedParams as any)[key])}`).join('&');
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(paramString).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/get-order-history`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestData, sig: signature }),
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getOrderDetail': {
          const params: any = {
            order_id: this.getNodeParameter('order_id', i) as string,
          };

          const requestData = {
            id: nonce,
            method: 'private/get-order-detail',
            api_key: credentials.apiKey,
            params: params,
            nonce: nonce,
          };

          const sortedParams = Object.keys(requestData).sort().reduce((sorted: any, key: string) => {
            sorted[key] = (requestData as any)[key];
            return sorted;
          }, {});

          const paramString = Object.keys(sortedParams).map(key => `${key}=${JSON.stringify((sortedParams as any)[key])}`).join('&');
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(paramString).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/get-order-detail`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestData, sig: signature }),
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getOpenOrders': {
          const params: any = {};

          const instrument_name = this.getNodeParameter('instrument_name', i) as string;
          if (instrument_name) params.instrument_name = instrument_name;

          const page_size = this.getNodeParameter('page_size', i) as number;
          if (page_size) params.page_size = page_size;

          const page = this.getNodeParameter('page', i) as number;
          if (page) params.page = page;

          const requestData = {
            id: nonce,
            method: 'private/get-open-orders',
            api_key: credentials.apiKey,
            params: params,
            nonce: nonce,
          };

          const sortedParams = Object.keys(requestData).sort().reduce((sorted: any, key: string) => {
            sorted[key] = (requestData as any)[key];
            return sorted;
          }, {});

          const paramString = Object.keys(sortedParams).map(key => `${key}=${JSON.stringify((sortedParams as any)[key])}`).join('&');
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(paramString).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/get-open-orders`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...requestData, sig: signature }),
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTradeOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('cryptocomexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTrades': {
          const instrumentName = this.getNodeParameter('instrumentName', i) as string;
          const startTs = this.getNodeParameter('startTs', i) as number;
          const endTs = this.getNodeParameter('endTs', i) as number;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const page = this.getNodeParameter('page', i) as number;

          const params: any = {
            id: Date.now(),
            method: 'private/get-trades',
            nonce: Date.now()
          };

          const requestParams: any = {};
          if (instrumentName) requestParams.instrument_name = instrumentName;
          if (startTs > 0) requestParams.start_ts = startTs;
          if (endTs > 0) requestParams.end_ts = endTs;
          if (pageSize) requestParams.page_size = pageSize;
          if (page) requestParams.page = page;

          if (Object.keys(requestParams).length > 0) {
            params.params = requestParams;
          }

          // Sort parameters alphabetically for signature
          const sortedParams = Object.keys(params).sort().reduce((sorted: any, key: string) => {
            sorted[key] = params[key];
            return sorted;
          }, {});

          // Create signature
          const paramString = JSON.stringify(sortedParams);
          const signature = createHmac('sha256', credentials.secretKey)
            .update(paramString)
            .digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/get-trades`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey
            },
            body: JSON.stringify({
              ...sortedParams,
              sig: signature
            }),
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMarketDataOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('cryptocomexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getInstruments': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/public/get-instruments`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrderBook': {
          const instrumentName = this.getNodeParameter('instrumentName', i) as string;
          const depth = this.getNodeParameter('depth', i) as number;

          const params = new URLSearchParams();
          params.append('instrument_name', instrumentName);
          if (depth) {
            params.append('depth', depth.toString());
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/public/get-book?${params.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTicker': {
          const instrumentName = this.getNodeParameter('instrumentName', i) as string;

          const params = new URLSearchParams();
          params.append('instrument_name', instrumentName);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/public/get-ticker?${params.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllTickers': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/public/get-tickers`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCandlestick': {
          const instrumentName = this.getNodeParameter('instrumentName', i) as string;
          const timeframe = this.getNodeParameter('timeframe', i) as string;
          const startTs = this.getNodeParameter('startTs', i) as number;
          const endTs = this.getNodeParameter('endTs', i) as number;

          const params = new URLSearchParams();
          params.append('instrument_name', instrumentName);
          params.append('timeframe', timeframe);
          
          if (startTs) {
            params.append('start_ts', startTs.toString());
          }
          if (endTs) {
            params.append('end_ts', endTs.toString());
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/public/get-candlestick?${params.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePositionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('cryptocomexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now();

      switch (operation) {
        case 'getPositions': {
          const params: any = {
            id: nonce,
            method: 'private/get-positions',
            api_key: credentials.apiKey,
            nonce,
          };

          const instrumentName = this.getNodeParameter('instrumentName', i) as string;
          if (instrumentName) {
            params.instrument_name = instrumentName;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/get-positions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: params,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositionHistory': {
          const params: any = {
            id: nonce,
            method: 'private/get-position-history',
            api_key: credentials.apiKey,
            nonce,
          };

          const instrumentName = this.getNodeParameter('instrumentName', i) as string;
          const startTs = this.getNodeParameter('startTs', i) as number;
          const endTs = this.getNodeParameter('endTs', i) as number;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const page = this.getNodeParameter('page', i) as number;

          if (instrumentName) {
            params.instrument_name = instrumentName;
          }
          if (startTs) {
            params.start_ts = startTs;
          }
          if (endTs) {
            params.end_ts = endTs;
          }
          if (pageSize) {
            params.page_size = pageSize;
          }
          if (page) {
            params.page = page;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/private/get-position-history`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: params,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
