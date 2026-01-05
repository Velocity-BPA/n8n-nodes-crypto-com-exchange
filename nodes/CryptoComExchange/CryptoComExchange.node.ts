/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from 'n8n-workflow';

import * as spotAccount from './actions/spotAccount/spotAccount';
import * as spotTrading from './actions/spotTrading/spotTrading';
import * as derivatives from './actions/derivatives/derivatives';
import * as margin from './actions/margin/margin';
import * as marketData from './actions/marketData/marketData';
import * as wallet from './actions/wallet/wallet';

export class CryptoComExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Crypto.com Exchange',
    name: 'cryptoComExchange',
    icon: 'file:cryptocom.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      'Interact with Crypto.com Exchange API for spot trading, derivatives, margin trading, wallet management, and market data',
    defaults: {
      name: 'Crypto.com Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'cryptoComExchangeApi',
        required: true,
        displayOptions: {
          show: {
            resource: ['spotAccount', 'spotTrading', 'derivatives', 'margin', 'wallet'],
          },
        },
      },
      {
        name: 'cryptoComExchangeApi',
        required: false,
        displayOptions: {
          show: {
            resource: ['marketData'],
          },
        },
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
            name: 'Spot Account',
            value: 'spotAccount',
            description: 'Manage spot account balances, deposits, and withdrawals',
          },
          {
            name: 'Spot Trading',
            value: 'spotTrading',
            description: 'Place and manage spot trading orders',
          },
          {
            name: 'Derivatives',
            value: 'derivatives',
            description: 'Manage derivatives positions and transfers',
          },
          {
            name: 'Margin',
            value: 'margin',
            description: 'Manage margin trading, borrowing, and repaying',
          },
          {
            name: 'Market Data',
            value: 'marketData',
            description: 'Get market data, tickers, order books, and candlesticks',
          },
          {
            name: 'Wallet',
            value: 'wallet',
            description: 'Manage wallet addresses and transaction history',
          },
        ],
        default: 'spotAccount',
      },
      // Spot Account Operations
      ...spotAccount.description,
      // Spot Trading Operations
      ...spotTrading.description,
      // Derivatives Operations
      ...derivatives.description,
      // Margin Operations
      ...margin.description,
      // Market Data Operations
      ...marketData.description,
      // Wallet Operations
      ...wallet.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: INodeExecutionData[] = [];

        switch (resource) {
          case 'spotAccount':
            result = await spotAccount.execute.call(this, i);
            break;
          case 'spotTrading':
            result = await spotTrading.execute.call(this, i);
            break;
          case 'derivatives':
            result = await derivatives.execute.call(this, i);
            break;
          case 'margin':
            result = await margin.execute.call(this, i);
            break;
          case 'marketData':
            result = await marketData.execute.call(this, i);
            break;
          case 'wallet':
            result = await wallet.execute.call(this, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
