/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { cryptoComApiRequest } from '../../transport/GenericFunctions';
import { API_METHODS } from '../../constants/constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['margin'],
      },
    },
    options: [
      {
        name: 'Get Margin Account',
        value: 'getMarginAccount',
        description: 'Get margin account details',
        action: 'Get margin account',
      },
      {
        name: 'Borrow',
        value: 'borrow',
        description: 'Borrow funds for margin trading',
        action: 'Borrow funds',
      },
      {
        name: 'Repay',
        value: 'repay',
        description: 'Repay margin loan',
        action: 'Repay loan',
      },
      {
        name: 'Get Loan History',
        value: 'getLoanHistory',
        description: 'List loan history',
        action: 'Get loan history',
      },
      {
        name: 'Get Interest History',
        value: 'getInterestHistory',
        description: 'List interest charges',
        action: 'Get interest history',
      },
      {
        name: 'Get Margin Trading User',
        value: 'getMarginTradingUser',
        description: 'Get margin trading user status',
        action: 'Get margin trading user',
      },
    ],
    default: 'getMarginAccount',
  },
  // Get Margin Account Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['margin'],
        operation: ['getMarginAccount'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Instrument Name',
        name: 'instrument_name',
        type: 'string',
        default: '',
        description: 'Filter by trading pair',
      },
    ],
  },
  // Borrow Fields
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['margin'],
        operation: ['borrow', 'repay'],
      },
    },
    default: 'USDT',
    description: 'Currency to borrow/repay',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['margin'],
        operation: ['borrow', 'repay'],
      },
    },
    default: '',
    description: 'Amount to borrow/repay',
  },
  {
    displayName: 'Instrument Name',
    name: 'instrumentName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['margin'],
        operation: ['borrow', 'repay'],
      },
    },
    default: 'BTC_USDT',
    description: 'Trading pair for margin',
  },
  // Loan History Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['margin'],
        operation: ['getLoanHistory', 'getInterestHistory'],
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
        displayName: 'Instrument Name',
        name: 'instrument_name',
        type: 'string',
        default: '',
        description: 'Filter by trading pair',
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
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData;

  if (operation === 'getMarginAccount') {
    const options = this.getNodeParameter('options', index) as {
      instrument_name?: string;
    };
    const params: IDataObject = {};

    if (options.instrument_name) params.instrument_name = options.instrument_name;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_MARGIN_ACCOUNT, params);
  } else if (operation === 'borrow') {
    const currency = this.getNodeParameter('currency', index) as string;
    const amount = this.getNodeParameter('amount', index) as string;
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;

    const params = {
      currency: currency.toUpperCase(),
      amount,
      instrument_name: instrumentName,
    };

    responseData = await cryptoComApiRequest.call(this, API_METHODS.BORROW, params);
  } else if (operation === 'repay') {
    const currency = this.getNodeParameter('currency', index) as string;
    const amount = this.getNodeParameter('amount', index) as string;
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;

    const params = {
      currency: currency.toUpperCase(),
      amount,
      instrument_name: instrumentName,
    };

    responseData = await cryptoComApiRequest.call(this, API_METHODS.REPAY, params);
  } else if (operation === 'getLoanHistory') {
    const options = this.getNodeParameter('options', index) as {
      currency?: string;
      instrument_name?: string;
      start_ts?: string;
      end_ts?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.currency) params.currency = options.currency.toUpperCase();
    if (options.instrument_name) params.instrument_name = options.instrument_name;
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_LOAN_HISTORY, params);
  } else if (operation === 'getInterestHistory') {
    const options = this.getNodeParameter('options', index) as {
      currency?: string;
      instrument_name?: string;
      start_ts?: string;
      end_ts?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.currency) params.currency = options.currency.toUpperCase();
    if (options.instrument_name) params.instrument_name = options.instrument_name;
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_INTEREST_HISTORY, params);
  } else if (operation === 'getMarginTradingUser') {
    responseData = await cryptoComApiRequest.call(
      this,
      API_METHODS.GET_MARGIN_TRADING_USER,
      {},
    );
  }

  const resultArray = Array.isArray(responseData) ? responseData : [responseData || {}];
  return this.helpers.returnJsonArray(resultArray as IDataObject[]);
}
