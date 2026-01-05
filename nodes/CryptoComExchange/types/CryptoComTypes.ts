/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// API Request/Response Types
export interface ICryptoComRequest {
  id: number;
  method: string;
  api_key?: string;
  params?: IDataObject;
  sig?: string;
  nonce: number;
}

export interface ICryptoComResponse {
  id: number;
  method: string;
  code: number;
  message?: string;
  result?: IDataObject;
}

// Resource Types
export type CryptoComResource =
  | 'spotAccount'
  | 'spotTrading'
  | 'derivatives'
  | 'margin'
  | 'marketData'
  | 'wallet';

// Spot Account Operations
export type SpotAccountOperation =
  | 'getAccountSummary'
  | 'getAccountBalance'
  | 'getTransactionHistory'
  | 'getDepositAddress'
  | 'createWithdrawal'
  | 'getWithdrawalHistory'
  | 'getDepositHistory';

// Spot Trading Operations
export type SpotTradingOperation =
  | 'createOrder'
  | 'cancelOrder'
  | 'cancelAllOrders'
  | 'getOpenOrders'
  | 'getOrderDetail'
  | 'getOrderHistory'
  | 'getTrades';

// Derivatives Operations
export type DerivativesOperation =
  | 'getPositions'
  | 'getPosition'
  | 'closePosition'
  | 'getTransferHistory'
  | 'transfer';

// Margin Operations
export type MarginOperation =
  | 'getMarginAccount'
  | 'borrow'
  | 'repay'
  | 'getLoanHistory'
  | 'getInterestHistory'
  | 'getMarginTradingUser';

// Market Data Operations
export type MarketDataOperation =
  | 'getInstruments'
  | 'getBook'
  | 'getTicker'
  | 'getTickers'
  | 'getTrades'
  | 'getCandlestick'
  | 'getValuations';

// Wallet Operations
export type WalletOperation =
  | 'getCurrencyNetworks'
  | 'getDepositAddress'
  | 'createWithdrawal'
  | 'getDepositHistory'
  | 'getWithdrawalHistory';

// Order Types
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT_LIMIT';
export type TimeInForce = 'GTC' | 'IOC' | 'FOK';
export type OrderStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'FILLED'
  | 'CANCELED'
  | 'REJECTED'
  | 'EXPIRED';

// Position Types
export type PositionDirection = 'LONG' | 'SHORT';

// Timeframe Types
export type CandlestickTimeframe =
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h'
  | '6h'
  | '12h'
  | '1D'
  | '7D'
  | '14D'
  | '1M';

// Account Types
export interface IAccountBalance {
  currency: string;
  balance: string;
  available: string;
  order: string;
  stake: string;
}

export interface IAccountSummary {
  accounts: IAccountBalance[];
}

// Order Types
export interface IOrder {
  order_id: string;
  client_oid?: string;
  status: OrderStatus;
  side: OrderSide;
  price: string;
  quantity: string;
  cumulative_quantity: string;
  cumulative_value: string;
  avg_price: string;
  fee: string;
  fee_currency: string;
  time_in_force: TimeInForce;
  exec_inst: string;
  create_time: number;
  update_time: number;
  instrument_name: string;
  type: OrderType;
}

// Trade Types
export interface ITrade {
  trade_id: string;
  order_id: string;
  client_oid?: string;
  instrument_name: string;
  side: OrderSide;
  price: string;
  quantity: string;
  fee: string;
  fee_currency: string;
  create_time: number;
}

// Position Types
export interface IPosition {
  instrument_name: string;
  quantity: string;
  cost: string;
  open_position_pnl: string;
  session_pnl: string;
  update_timestamp_ms: number;
  type: string;
}

// Margin Types
export interface IMarginAccount {
  currency: string;
  balance: string;
  available: string;
  borrowed: string;
  interest: string;
}

// Market Data Types
export interface IInstrument {
  instrument_name: string;
  quote_currency: string;
  base_currency: string;
  price_decimals: number;
  quantity_decimals: number;
  margin_trading_enabled: boolean;
  margin_trading_enabled_5x: boolean;
  margin_trading_enabled_10x: boolean;
  max_quantity: string;
  min_quantity: string;
  max_price: string;
  min_price: string;
}

export interface IOrderBook {
  bids: Array<[string, string, number]>;
  asks: Array<[string, string, number]>;
  t: number;
}

export interface ITicker {
  i: string;
  b: string;
  k: string;
  a: string;
  t: number;
  v: string;
  h: string;
  l: string;
  c: string;
}

export interface ICandlestick {
  t: number;
  o: string;
  h: string;
  l: string;
  c: string;
  v: string;
}

// Wallet Types
export interface IDepositAddress {
  currency: string;
  network: string;
  address: string;
  tag?: string;
  create_time: number;
  status: string;
}

export interface IWithdrawal {
  id: string;
  client_wid?: string;
  currency: string;
  amount: string;
  fee: string;
  address: string;
  create_time: number;
  status: string;
  network: string;
  txid?: string;
}

export interface IDeposit {
  id: string;
  currency: string;
  amount: string;
  fee: string;
  address: string;
  create_time: number;
  update_time: number;
  status: string;
  network: string;
  txid?: string;
}

// Error Code Mapping
export const ERROR_CODES: Record<number, string> = {
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

// Helper to get error message
export function getErrorMessage(code: number): string {
  return ERROR_CODES[code] || `Unknown error (code: ${code})`;
}
