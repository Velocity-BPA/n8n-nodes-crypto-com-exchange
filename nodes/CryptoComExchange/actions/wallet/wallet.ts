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
        resource: ['wallet'],
      },
    },
    options: [
      {
        name: 'Get Currency Networks',
        value: 'getCurrencyNetworks',
        description: 'Get available networks for a currency',
        action: 'Get currency networks',
      },
      {
        name: 'Get Deposit Address',
        value: 'getDepositAddress',
        description: 'Generate a deposit address',
        action: 'Get deposit address',
      },
      {
        name: 'Create Withdrawal',
        value: 'createWithdrawal',
        description: 'Initiate a withdrawal',
        action: 'Create withdrawal',
      },
      {
        name: 'Get Deposit History',
        value: 'getDepositHistory',
        description: 'List deposit history',
        action: 'Get deposit history',
      },
      {
        name: 'Get Withdrawal History',
        value: 'getWithdrawalHistory',
        description: 'List withdrawal history',
        action: 'Get withdrawal history',
      },
    ],
    default: 'getCurrencyNetworks',
  },
  // Get Currency Networks
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['getCurrencyNetworks'],
      },
    },
    default: 'BTC',
    description: 'Currency code (e.g., BTC, ETH, USDT)',
  },
  // Get Deposit Address
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['getDepositAddress'],
      },
    },
    default: 'BTC',
    description: 'Currency code (e.g., BTC, ETH, USDT)',
  },
  {
    displayName: 'Network',
    name: 'network',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['getDepositAddress'],
      },
    },
    default: '',
    description: 'Blockchain network (optional, defaults to native network)',
  },
  // Create Withdrawal
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['createWithdrawal'],
      },
    },
    default: 'BTC',
    description: 'Currency to withdraw',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['createWithdrawal'],
      },
    },
    default: '',
    description: 'Amount to withdraw',
  },
  {
    displayName: 'Address',
    name: 'address',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['createWithdrawal'],
      },
    },
    default: '',
    description: 'Withdrawal destination address',
  },
  {
    displayName: 'Network',
    name: 'network',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['createWithdrawal'],
      },
    },
    default: '',
    description: 'Blockchain network for withdrawal',
  },
  {
    displayName: 'Withdrawal Options',
    name: 'withdrawalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['createWithdrawal'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Address Tag',
        name: 'address_tag',
        type: 'string',
        default: '',
        description: 'Destination address tag/memo (for coins that require it like XRP, XLM)',
      },
      {
        displayName: 'Client Withdrawal ID',
        name: 'client_wid',
        type: 'string',
        default: '',
        description: 'Client-provided withdrawal ID for tracking',
      },
    ],
  },
  // Deposit/Withdrawal History Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['wallet'],
        operation: ['getDepositHistory', 'getWithdrawalHistory'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        description: 'Filter by currency code',
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
        displayName: 'Status',
        name: 'status',
        type: 'string',
        default: '',
        description: 'Filter by status',
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

  if (operation === 'getCurrencyNetworks') {
    const currency = this.getNodeParameter('currency', index) as string;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_CURRENCY_NETWORKS, {
      currency: currency.toUpperCase(),
    });
  } else if (operation === 'getDepositAddress') {
    const currency = this.getNodeParameter('currency', index) as string;
    const network = this.getNodeParameter('network', index) as string;

    const params: IDataObject = {
      currency: currency.toUpperCase(),
    };
    if (network) params.network = network;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_DEPOSIT_ADDRESS, params);
  } else if (operation === 'createWithdrawal') {
    const currency = this.getNodeParameter('currency', index) as string;
    const amount = this.getNodeParameter('amount', index) as string;
    const address = this.getNodeParameter('address', index) as string;
    const network = this.getNodeParameter('network', index) as string;
    const withdrawalOptions = this.getNodeParameter('withdrawalOptions', index) as {
      address_tag?: string;
      client_wid?: string;
    };

    const params: IDataObject = {
      currency: currency.toUpperCase(),
      amount,
      address,
      network,
    };

    if (withdrawalOptions.address_tag) params.address_tag = withdrawalOptions.address_tag;
    if (withdrawalOptions.client_wid) params.client_wid = withdrawalOptions.client_wid;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.CREATE_WITHDRAWAL, params);
  } else if (operation === 'getDepositHistory') {
    const options = this.getNodeParameter('options', index) as {
      currency?: string;
      start_ts?: string;
      end_ts?: string;
      status?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.currency) params.currency = options.currency.toUpperCase();
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.status) params.status = options.status;
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_DEPOSIT_HISTORY, params);
  } else if (operation === 'getWithdrawalHistory') {
    const options = this.getNodeParameter('options', index) as {
      currency?: string;
      start_ts?: string;
      end_ts?: string;
      status?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.currency) params.currency = options.currency.toUpperCase();
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.status) params.status = options.status;
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_WITHDRAWAL_HISTORY, params);
  }

  const resultArray = Array.isArray(responseData) ? responseData : [responseData || {}];
  return this.helpers.returnJsonArray(resultArray as IDataObject[]);
}
