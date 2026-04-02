import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CryptocomExchangeApi implements ICredentialType {
	name = 'cryptocomExchangeApi';
	displayName = 'Crypto.com Exchange API';
	documentationUrl = 'https://exchange-docs.crypto.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for your Crypto.com Exchange account',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API secret for your Crypto.com Exchange account',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.crypto.com/exchange/v1',
			description: 'The base URL for the Crypto.com Exchange API',
		},
	];
}