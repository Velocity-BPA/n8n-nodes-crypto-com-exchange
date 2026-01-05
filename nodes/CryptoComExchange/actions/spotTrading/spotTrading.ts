/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { cryptoComApiRequest } from '../../transport/GenericFunctions';
import { API_METHODS, ORDER_SIDE_OPTIONS, ORDER_TYPE_OPTIONS, TIME_IN_FORCE_OPTIONS } from '../../constants/constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
      },
    },
    options: [
      {
        name: 'Create Order',
        value: 'createOrder',
        description: 'Place a new order',
        action: 'Create order',
      },
      {
        name: 'Cancel Order',
        value: 'cancelOrder',
        description: 'Cancel an order by ID',
        action: 'Cancel order',
      },
      {
        name: 'Cancel All Orders',
        value: 'cancelAllOrders',
        description: 'Cancel all open orders',
        action: 'Cancel all orders',
      },
      {
        name: 'Get Open Orders',
        value: 'getOpenOrders',
        description: 'List all open orders',
        action: 'Get open orders',
      },
      {
        name: 'Get Order Detail',
        value: 'getOrderDetail',
        description: 'Get details of a specific order',
        action: 'Get order detail',
      },
      {
        name: 'Get Order History',
        value: 'getOrderHistory',
        description: 'List historical orders',
        action: 'Get order history',
      },
      {
        name: 'Get Trades',
        value: 'getTrades',
        description: 'Get trade history',
        action: 'Get trades',
      },
    ],
    default: 'createOrder',
  },
  // Create Order Fields
  {
    displayName: 'Instrument Name',
    name: 'instrumentName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['createOrder'],
      },
    },
    default: 'BTC_USDT',
    description: 'Trading pair (e.g., BTC_USDT, ETH_USDT)',
  },
  {
    displayName: 'Side',
    name: 'side',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['createOrder'],
      },
    },
    options: ORDER_SIDE_OPTIONS,
    default: 'BUY',
    description: 'Order side',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['createOrder'],
      },
    },
    options: ORDER_TYPE_OPTIONS,
    default: 'LIMIT',
    description: 'Order type',
  },
  {
    displayName: 'Quantity',
    name: 'quantity',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['createOrder'],
      },
    },
    default: '',
    description: 'Order quantity',
  },
  {
    displayName: 'Price',
    name: 'price',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['createOrder'],
        type: ['LIMIT', 'STOP_LIMIT', 'TAKE_PROFIT_LIMIT'],
      },
    },
    default: '',
    description: 'Order price (required for limit orders)',
  },
  {
    displayName: 'Order Options',
    name: 'orderOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['createOrder'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Client Order ID',
        name: 'client_oid',
        type: 'string',
        default: '',
        description: 'Client-provided order ID',
      },
      {
        displayName: 'Time In Force',
        name: 'time_in_force',
        type: 'options',
        options: TIME_IN_FORCE_OPTIONS,
        default: 'GTC',
        description: 'Time in force for the order',
      },
      {
        displayName: 'Trigger Price',
        name: 'trigger_price',
        type: 'string',
        default: '',
        description: 'Trigger price for stop orders',
      },
      {
        displayName: 'Post Only',
        name: 'exec_inst',
        type: 'boolean',
        default: false,
        description: 'Whether the order is post-only (maker only)',
      },
    ],
  },
  // Cancel Order Fields
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['cancelOrder', 'getOrderDetail'],
      },
    },
    default: '',
    description: 'The order ID to cancel or retrieve',
  },
  {
    displayName: 'Instrument Name',
    name: 'instrumentName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['cancelOrder'],
      },
    },
    default: 'BTC_USDT',
    description: 'Trading pair of the order',
  },
  // Cancel All Orders - Instrument
  {
    displayName: 'Instrument Name',
    name: 'instrumentName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['cancelAllOrders'],
      },
    },
    default: '',
    description: 'Trading pair to cancel orders for (leave empty to cancel all)',
  },
  // Get Open Orders / Order History / Trades Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['spotTrading'],
        operation: ['getOpenOrders', 'getOrderHistory', 'getTrades'],
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

  if (operation === 'createOrder') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;
    const side = this.getNodeParameter('side', index) as string;
    const type = this.getNodeParameter('type', index) as string;
    const quantity = this.getNodeParameter('quantity', index) as string;
    const orderOptions = this.getNodeParameter('orderOptions', index) as {
      client_oid?: string;
      time_in_force?: string;
      trigger_price?: string;
      exec_inst?: boolean;
    };

    const params: IDataObject = {
      instrument_name: instrumentName,
      side,
      type,
      quantity,
    };

    // Add price for limit orders
    if (['LIMIT', 'STOP_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(type)) {
      const price = this.getNodeParameter('price', index) as string;
      if (price) params.price = price;
    }

    // Add optional parameters
    if (orderOptions.client_oid) params.client_oid = orderOptions.client_oid;
    if (orderOptions.time_in_force) params.time_in_force = orderOptions.time_in_force;
    if (orderOptions.trigger_price) params.trigger_price = orderOptions.trigger_price;
    if (orderOptions.exec_inst) params.exec_inst = 'POST_ONLY';

    responseData = await cryptoComApiRequest.call(this, API_METHODS.CREATE_ORDER, params);
  } else if (operation === 'cancelOrder') {
    const orderId = this.getNodeParameter('orderId', index) as string;
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;

    const params = {
      order_id: orderId,
      instrument_name: instrumentName,
    };

    responseData = await cryptoComApiRequest.call(this, API_METHODS.CANCEL_ORDER, params);
  } else if (operation === 'cancelAllOrders') {
    const instrumentName = this.getNodeParameter('instrumentName', index) as string;

    const params: IDataObject = {};
    if (instrumentName) params.instrument_name = instrumentName;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.CANCEL_ALL_ORDERS, params);
  } else if (operation === 'getOpenOrders') {
    const options = this.getNodeParameter('options', index) as {
      instrument_name?: string;
      start_ts?: string;
      end_ts?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.instrument_name) params.instrument_name = options.instrument_name;
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_OPEN_ORDERS, params);
  } else if (operation === 'getOrderDetail') {
    const orderId = this.getNodeParameter('orderId', index) as string;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_ORDER_DETAIL, {
      order_id: orderId,
    });
  } else if (operation === 'getOrderHistory') {
    const options = this.getNodeParameter('options', index) as {
      instrument_name?: string;
      start_ts?: string;
      end_ts?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.instrument_name) params.instrument_name = options.instrument_name;
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_ORDER_HISTORY, params);
  } else if (operation === 'getTrades') {
    const options = this.getNodeParameter('options', index) as {
      instrument_name?: string;
      start_ts?: string;
      end_ts?: string;
      page_size?: number;
      page?: number;
    };
    const params: IDataObject = {};

    if (options.instrument_name) params.instrument_name = options.instrument_name;
    if (options.start_ts) params.start_ts = new Date(options.start_ts).getTime();
    if (options.end_ts) params.end_ts = new Date(options.end_ts).getTime();
    if (options.page_size) params.page_size = options.page_size;
    if (options.page !== undefined) params.page = options.page;

    responseData = await cryptoComApiRequest.call(this, API_METHODS.GET_TRADES, params);
  }

  const resultArray = Array.isArray(responseData) ? responseData : [responseData || {}];
  return this.helpers.returnJsonArray(resultArray as IDataObject[]);
}
