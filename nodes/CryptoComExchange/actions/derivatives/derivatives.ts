/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { cryptoComApiRequest } from '../../transport/GenericFunctions';
import { API_METHODS, TRANSFER_DIRECTION_OPTIONS } from '../../constants/constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['derivatives'],
      },
    },
    options: [
      {
        name: 'Get Positions',
        value: 'getPositions',
        description: 'List all open positions',
        action: 'Get positions',
      },
      {
        name: 'Get Position',
        value: 'getPosition',
        description: 'Get a specific position',
        action: 'Get position',
      },
      {
        name: 'Close Position',
        value: 'closePosition',
        description: 'Close an open position',
        action: 'Close position',
      },
      {
        name: 'Get Transfer History',
        value: 'getTransferHistory',
        description: 'List transfers between spot and derivatives',
        action: 'Get transfer history',
      },
      {
        name: 'Transfer',
        value: 'transfer',
        description: 'Transfer funds between spot and derivatives',
        action: 'Transfer funds',
      },
    ],
    default: 'getPositions',
  },
  // Get Position - Instrument Name
  {
    displayName: 'Instrument Name',
    name: 'instrumentName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['getPosition', 'closePosition'],
      },
    },
    default: 'BTCUSD-PERP',
    description: 'Contract name (e.g., BTCUSD-PERP)',
  },
  // Close Position Options
  {
    displayName: 'Close Options',
    name: 'closeOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['closePosition'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Market', value: 'MARKET' },
          { name: 'Limit', value: 'LIMIT' },
        ],
        default: 'MARKET',
        description: 'Order type for closing position',
      },
      {
        displayName: 'Price',
        name: 'price',
        type: 'string',
        default: '',
        description: 'Price for limit close orders',
      },
    ],
  },
  // Transfer Fields
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['transfer'],
      },
    },
    default: 'USDT',
    description: 'Currency to transfer',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['transfer'],
      },
    },
    default: '',
    description: 'Amount to transfer',
  },
  {
    displayName: 'Direction',
    name: 'direction',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['transfer'],
      },
    },
    options: TRANSFER_DIRECTION_OPTIONS,
    default: 'SPOT_TO_DERIV',
    description: 'Transfer direction',
  },
  // Transfer History Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['getTransferHistory'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        description: 'Filter by currency',
      },
      {
        displayName: 'Direction',
        name: 'direction',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          ...TRANSFER_DIRECTION_OPTIONS,
        ],
        default: '',
        description: 'Filter by transfer direction',
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
      {
        displayName: 'Page Size',
        name: 'page_size',
        type: 'number',
        default: 20,
        description: 'Number of results per page (max 200)',
      },
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 0,
        description: 'Page number (starting from 0)',
      },
    ],
  },
  // Get Positions Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['derivatives'],
        operation: ['getPositions'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Instrument Name',
        name: 'instrument_name',
        type: 'string',
        default: '',
        description: 'Filter by contract name',
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

  if (operation === 'getPositions') {
    const options = this.getNodeParameter('options', index) as {
      instrument_name?: string;
    };
    const params: IDataObject = {};

    if (options.instrument_name) params.instrument_name = options.instrument_name;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_POSITIONS, params);
  } else if (operation === 'getPosition') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_POSITIONS, {
      instrument_name: instrumentName,
    });
  } else if (operation === 'closePosition') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;
    const closeOptions = this.getNodeParameter('closeOptions', index) as {
      type?: string;
      price?: string;
    };

    const params: IDataObject = {
      instrument_name: instrumentName,
    };

    if (closeOptions.type) params.type = closeOptions.type;
    if (closeOptions.price) params.price = closeOptions.price;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.CLOSE_POSITION, params);
  } else if (operation === 'getTransferHistory') {
    const options = this.getNodeParameter('options', index) as {
      currency?: string;
      direction?: string;
      start_ts?: string;
      end_ts?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.currency) params.currency = options.currency.toUpperCase();
    if (options.direction) params.direction = options.direction;
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_TRANSFER_HISTORY, params);
  } else if (operation === 'transfer') {
    const currency = this.getNodeParameter('currency', index) as string;
    const amount = this.getNodeParameter('amount', index) as string;
    const direction = this.getNodeParameter('direction', index) as string;

    const params = {
      currency: currency.toUpperCase(),
      amount,
      direction,
    };

    responseData = await cryptoComApiRequest.call(this, API_METHODS.TRANSFER, params);
  }

  const resultArray = Array.isArray(responseData) ? responseData : [responseData || {}];
  return this.helpers.returnJsonArray(resultArray as IDataObject[]);
}
