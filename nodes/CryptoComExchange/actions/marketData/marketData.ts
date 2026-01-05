/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { cryptoComApiRequest } from '../../transport/GenericFunctions';
import { API_METHODS, CANDLESTICK_TIMEFRAME_OPTIONS, ORDER_BOOK_DEPTH_OPTIONS } from '../../constants/constants';

export const description: INodeProperties[] = [
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
        description: 'List all available trading pairs',
        action: 'Get instruments',
      },
      {
        name: 'Get Order Book',
        value: 'getBook',
        description: 'Get order book for an instrument',
        action: 'Get order book',
      },
      {
        name: 'Get Ticker',
        value: 'getTicker',
        description: 'Get ticker data for an instrument',
        action: 'Get ticker',
      },
      {
        name: 'Get All Tickers',
        value: 'getTickers',
        description: 'Get ticker data for all instruments',
        action: 'Get all tickers',
      },
      {
        name: 'Get Public Trades',
        value: 'getTrades',
        description: 'Get recent public trades',
        action: 'Get public trades',
      },
      {
        name: 'Get Candlestick',
        value: 'getCandlestick',
        description: 'Get OHLC candlestick data',
        action: 'Get candlestick',
      },
      {
        name: 'Get Valuations',
        value: 'getValuations',
        description: 'Get price valuations',
        action: 'Get valuations',
      },
    ],
    default: 'getInstruments',
  },
  // Instrument Name for most operations
  {
    displayName: 'Instrument Name',
    name: 'instrumentName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getBook', 'getTicker', 'getTrades', 'getCandlestick'],
      },
    },
    default: 'BTC_USDT',
    description: 'Trading pair (e.g., BTC_USDT)',
  },
  // Order Book Depth
  {
    displayName: 'Depth',
    name: 'depth',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getBook'],
      },
    },
    options: ORDER_BOOK_DEPTH_OPTIONS,
    default: 50,
    description: 'Order book depth',
  },
  // Candlestick Timeframe
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
    options: CANDLESTICK_TIMEFRAME_OPTIONS,
    default: '1h',
    description: 'Candlestick interval',
  },
  // Candlestick Options
  {
    displayName: 'Options',
    name: 'candlestickOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getCandlestick'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Count',
        name: 'count',
        type: 'number',
        default: 100,
        description: 'Number of candlesticks to retrieve (max 300)',
      },
      {
        displayName: 'Start Time',
        name: 'start_ts',
        type: 'dateTime',
        default: '',
        description: 'Start timestamp for the query',
      },
      {
        displayName: 'End Time',
        name: 'end_ts',
        type: 'dateTime',
        default: '',
        description: 'End timestamp for the query',
      },
    ],
  },
  // Public Trades Options
  {
    displayName: 'Options',
    name: 'tradeOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getTrades'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Count',
        name: 'count',
        type: 'number',
        default: 100,
        description: 'Number of trades to retrieve (max 200)',
      },
    ],
  },
  // Get Instruments Options
  {
    displayName: 'Options',
    name: 'instrumentOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getInstruments'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Instrument Type',
        name: 'instrument_type',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Spot', value: 'SPOT' },
          { name: 'Perpetual', value: 'PERPETUAL' },
          { name: 'Future', value: 'FUTURE' },
        ],
        default: '',
        description: 'Filter by instrument type',
      },
    ],
  },
  // Get Valuations Options
  {
    displayName: 'Options',
    name: 'valuationOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['marketData'],
        operation: ['getValuations'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Instrument Name',
        name: 'instrument_name',
        type: 'string',
        default: '',
        description: 'Filter by instrument name',
      },
      {
        displayName: 'Valuation Type',
        name: 'valuation_type',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Index Price', value: 'index_price' },
          { name: 'Mark Price', value: 'mark_price' },
          { name: 'Funding Rate', value: 'funding_rate' },
        ],
        default: '',
        description: 'Type of valuation data',
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData;

  if (operation === 'getInstruments') {
    const instrumentOptions = this.getNodeParameter('instrumentOptions', index) as {
      instrument_type?: string;
    };
    const params: IDataObject = {};

    if (instrumentOptions.instrument_type) {
      params.instrument_type = instrumentOptions.instrument_type;
    }

    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_INSTRUMENTS,
      params,
      true,
    );
  } else if (operation === 'getBook') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;
    const depth = this.getNodeParameter('depth', index) as number;

    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_BOOK,
      {
        instrument_name: instrumentName,
        depth,
      },
      true,
    );
  } else if (operation === 'getTicker') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;

    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_TICKER,
      {
        instrument_name: instrumentName,
      },
      true,
    );
  } else if (operation === 'getTickers') {
    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_TICKERS, {}, true);
  } else if (operation === 'getTrades') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;
    const tradeOptions = this.getNodeParameter('tradeOptions', index) as {
      count?: number;
    };

    const params: IDataObject = {
      instrument_name: instrumentName,
    };

    if (tradeOptions.count) params.count = tradeOptions.count;

    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_PUBLIC_TRADES,
      params,
      true,
    );
  } else if (operation === 'getCandlestick') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;
    const timeframe = this.getNodeParameter('timeframe', index) as string;
    const candlestickOptions = this.getNodeParameter('candlestickOptions', index) as {
      count?: number;
      start_ts?: string;
      end_ts?: string;
    };

    const params: IDataObject = {
      instrument_name: instrumentName,
      timeframe,
    };

    if (candlestickOptions.count) params.count = candlestickOptions.count;
    if (candlestickOptions.start_ts) {
      params.start_ts = new Date(candlestickOptions.start_ts).getTime();
    }
    if (candlestickOptions.end_ts) {
      params.end_ts = new Date(candlestickOptions.end_ts).getTime();
    }

    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_CANDLESTICK,
      params,
      true,
    );
  } else if (operation === 'getValuations') {
    const valuationOptions = this.getNodeParameter('valuationOptions', index) as {
      instrument_name?: string;
      valuation_type?: string;
    };
    const params: IDataObject = {};

    if (valuationOptions.instrument_name) {
      params.instrument_name = valuationOptions.instrument_name;
    }
    if (valuationOptions.valuation_type) {
      params.valuation_type = valuationOptions.valuation_type;
    }

    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_VALUATIONS,
      params,
      true,
    );
  }

  const resultArray = Array.isArray(responseData) ? responseData : [responseData || {}];
  return this.helpers.returnJsonArray(resultArray as IDataObject[]);
}
