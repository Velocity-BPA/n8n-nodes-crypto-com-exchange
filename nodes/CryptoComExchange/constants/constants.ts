/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// API Base URL
export const API_BASE_URL = 'https://api.crypto.com/exchange/v1';

// API Methods
export const API_METHODS = {
  // Spot Account
  GET_ACCOUNT_SUMMARY: 'private/user-balance',
  GET_TRANSACTION_HISTORY: 'private/get-transactions',
  GET_DEPOSIT_ADDRESS: 'private/get-deposit-address',
  CREATE_WITHDRAWAL: 'private/create-withdrawal',
  GET_WITHDRAWAL_HISTORY: 'private/get-withdrawal-history',
  GET_DEPOSIT_HISTORY: 'private/get-deposit-history',

  // Spot Trading
  CREATE_ORDER: 'private/create-order',
  CANCEL_ORDER: 'private/cancel-order',
  CANCEL_ALL_ORDERS: 'private/cancel-all-orders',
  GET_OPEN_ORDERS: 'private/get-open-orders',
  GET_ORDER_DETAIL: 'private/get-order-detail',
  GET_ORDER_HISTORY: 'private/get-order-history',
  GET_TRADES: 'private/get-trades',

  // Derivatives
  GET_POSITIONS: 'private/get-positions',
  CLOSE_POSITION: 'private/close-position',
  GET_TRANSFER_HISTORY: 'private/deriv/get-transfer-history',
  TRANSFER: 'private/deriv/transfer',

  // Margin
  GET_MARGIN_ACCOUNT: 'private/margin/get-user-config',
  BORROW: 'private/margin/borrow',
  REPAY: 'private/margin/repay',
  GET_LOAN_HISTORY: 'private/margin/get-loan-history',
  GET_INTEREST_HISTORY: 'private/margin/get-interest-history',
  GET_MARGIN_TRADING_USER: 'private/margin/get-user-config',

  // Market Data (Public)
  GET_INSTRUMENTS: 'public/get-instruments',
  GET_BOOK: 'public/get-book',
  GET_TICKER: 'public/get-ticker',
  GET_TICKERS: 'public/get-tickers',
  GET_PUBLIC_TRADES: 'public/get-trades',
  GET_CANDLESTICK: 'public/get-candlestick',
  GET_VALUATIONS: 'public/get-valuations',

  // Wallet
  GET_CURRENCY_NETWORKS: 'private/get-currency-networks',
} as const;

// Order Side Options
export const ORDER_SIDE_OPTIONS = [
  { name: 'Buy', value: 'BUY' },
  { name: 'Sell', value: 'SELL' },
];

// Order Type Options
export const ORDER_TYPE_OPTIONS = [
  { name: 'Limit', value: 'LIMIT' },
  { name: 'Market', value: 'MARKET' },
  { name: 'Stop Limit', value: 'STOP_LIMIT' },
  { name: 'Stop Loss', value: 'STOP_LOSS' },
  { name: 'Take Profit Limit', value: 'TAKE_PROFIT_LIMIT' },
];

// Time in Force Options
export const TIME_IN_FORCE_OPTIONS = [
  { name: 'Good Till Cancelled (GTC)', value: 'GTC' },
  { name: 'Immediate or Cancel (IOC)', value: 'IOC' },
  { name: 'Fill or Kill (FOK)', value: 'FOK' },
];

// Position Direction Options
export const POSITION_DIRECTION_OPTIONS = [
  { name: 'Long', value: 'LONG' },
  { name: 'Short', value: 'SHORT' },
];

// Candlestick Timeframe Options
export const CANDLESTICK_TIMEFRAME_OPTIONS = [
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
];

// Order Book Depth Options
export const ORDER_BOOK_DEPTH_OPTIONS = [
  { name: '10', value: 10 },
  { name: '20', value: 20 },
  { name: '50', value: 50 },
  { name: '100', value: 100 },
  { name: '150', value: 150 },
];

// Page Size Options
export const PAGE_SIZE_OPTIONS = [
  { name: '20', value: 20 },
  { name: '50', value: 50 },
  { name: '100', value: 100 },
  { name: '200', value: 200 },
];

// Transfer Direction Options
export const TRANSFER_DIRECTION_OPTIONS = [
  { name: 'Spot to Derivatives', value: 'SPOT_TO_DERIV' },
  { name: 'Derivatives to Spot', value: 'DERIV_TO_SPOT' },
];

// Common Currency Options (most traded)
export const COMMON_CURRENCIES = [
  { name: 'Bitcoin (BTC)', value: 'BTC' },
  { name: 'Ethereum (ETH)', value: 'ETH' },
  { name: 'Tether (USDT)', value: 'USDT' },
  { name: 'USD Coin (USDC)', value: 'USDC' },
  { name: 'Cronos (CRO)', value: 'CRO' },
  { name: 'Solana (SOL)', value: 'SOL' },
  { name: 'Cardano (ADA)', value: 'ADA' },
  { name: 'Ripple (XRP)', value: 'XRP' },
  { name: 'Dogecoin (DOGE)', value: 'DOGE' },
  { name: 'Polygon (MATIC)', value: 'MATIC' },
];

// Common Trading Pairs
export const COMMON_TRADING_PAIRS = [
  { name: 'BTC/USDT', value: 'BTC_USDT' },
  { name: 'ETH/USDT', value: 'ETH_USDT' },
  { name: 'CRO/USDT', value: 'CRO_USDT' },
  { name: 'SOL/USDT', value: 'SOL_USDT' },
  { name: 'XRP/USDT', value: 'XRP_USDT' },
  { name: 'ADA/USDT', value: 'ADA_USDT' },
  { name: 'DOGE/USDT', value: 'DOGE_USDT' },
  { name: 'ETH/BTC', value: 'ETH_BTC' },
  { name: 'MATIC/USDT', value: 'MATIC_USDT' },
  { name: 'BTC/USDC', value: 'BTC_USDC' },
];

// Withdrawal Status Types
export const WITHDRAWAL_STATUS = {
  0: 'Pending',
  1: 'Processing',
  2: 'Rejected',
  3: 'Payment In-Progress',
  4: 'Payment Failed',
  5: 'Completed',
  6: 'Cancelled',
};

// Deposit Status Types
export const DEPOSIT_STATUS = {
  0: 'Not Arrived',
  1: 'Arrived',
  2: 'Failed',
  3: 'Pending',
};
