# n8n-nodes-crypto-com-exchange

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node that integrates with the Crypto.com Exchange API, providing access to 5 core resources for cryptocurrency trading operations. This node enables automated trading, account management, market data retrieval, and position monitoring through n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Crypto.com](https://img.shields.io/badge/Crypto.com-Exchange-orange)
![Trading](https://img.shields.io/badge/Trading-Automated-green)
![API](https://img.shields.io/badge/API-v2-yellow)

## Features

- **Account Management** - Retrieve account information, balances, and trading permissions
- **Order Operations** - Create, modify, cancel, and monitor trading orders across all supported trading pairs
- **Trade History** - Access comprehensive trade execution data and transaction history
- **Market Data** - Real-time and historical market data including orderbooks, tickers, and candles
- **Position Tracking** - Monitor open positions, margin requirements, and portfolio performance
- **Rate Limit Handling** - Built-in rate limiting and retry logic for API compliance
- **Comprehensive Error Handling** - Detailed error messages and status codes for debugging
- **Type Safety** - Full TypeScript support with proper type definitions

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-crypto-com-exchange`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-crypto-com-exchange
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-crypto-com-exchange.git
cd n8n-nodes-crypto-com-exchange
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-crypto-com-exchange
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Crypto.com Exchange API key | Yes |
| Secret Key | Your Crypto.com Exchange secret key | Yes |
| Environment | Choose between Sandbox and Production | Yes |
| Passphrase | API key passphrase (if configured) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve account details and trading permissions |
| Get Balance | Get account balances for all currencies |
| Get Deposit History | Retrieve deposit transaction history |
| Get Withdrawal History | Retrieve withdrawal transaction history |
| Get Fee Rate | Get trading fee rates for specific trading pairs |

### 2. Order

| Operation | Description |
|-----------|-------------|
| Create Order | Place a new buy or sell order |
| Cancel Order | Cancel an existing open order |
| Cancel All Orders | Cancel all open orders for a trading pair |
| Get Order | Retrieve details of a specific order |
| Get Open Orders | List all currently open orders |
| Get Order History | Retrieve historical order data |
| Modify Order | Update price or quantity of an existing order |

### 3. Trade

| Operation | Description |
|-----------|-------------|
| Get Trades | Retrieve trade execution history |
| Get Trade by Order | Get trades for a specific order ID |
| Get Recent Trades | Retrieve recent trade executions |
| Get Trade Statistics | Get trading volume and performance statistics |

### 4. Market Data

| Operation | Description |
|-----------|-------------|
| Get Ticker | Retrieve current ticker information for trading pairs |
| Get Orderbook | Get current order book data |
| Get Candles | Retrieve historical candlestick data |
| Get Instruments | List all available trading instruments |
| Get Market Depth | Get market depth information |
| Get Recent Trades | Retrieve recent public trades |

### 5. Position

| Operation | Description |
|-----------|-------------|
| Get Positions | Retrieve current open positions |
| Get Position by Instrument | Get position for a specific trading pair |
| Get Margin Requirements | Retrieve margin requirements and utilization |
| Get Portfolio Summary | Get overall portfolio performance metrics |

## Usage Examples

```javascript
// Create a market buy order for Bitcoin
{
  "instrument_name": "BTC_USDT",
  "side": "BUY",
  "type": "MARKET",
  "notional": 1000,
  "client_oid": "my_order_001"
}
```

```javascript
// Get account balance for all currencies
{
  "resource": "Account",
  "operation": "Get Balance"
}
```

```javascript
// Retrieve recent trades for Ethereum
{
  "instrument_name": "ETH_USDT",
  "start_time": 1640995200000,
  "end_time": 1641081600000,
  "page_size": 50
}
```

```javascript
// Get real-time market data for multiple pairs
{
  "instrument_name": "BTC_USDT,ETH_USDT,ADA_USDT",
  "depth": 10
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials | Verify API key and secret are correct |
| 403 Forbidden | Insufficient permissions | Check API key has required trading permissions |
| 429 Too Many Requests | Rate limit exceeded | Implement delays between requests |
| 10001 Invalid instrument | Trading pair not found | Verify instrument name format (e.g., BTC_USDT) |
| 10004 Invalid quantity | Order size outside limits | Check minimum/maximum order sizes |
| 20002 Insufficient balance | Not enough funds for order | Verify account balance before placing orders |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-crypto-com-exchange/issues)
- **API Documentation**: [Crypto.com Exchange API](https://exchange-docs.crypto.com/spot/index.html)
- **Community**: [Crypto.com Developer Portal](https://crypto.com/developer-platform)