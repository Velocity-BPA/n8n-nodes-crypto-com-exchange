# n8n-nodes-crypto-com-exchange

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Crypto.com Exchange providing spot trading, derivatives, margin trading, wallet management, and market data operations with HMAC-SHA256 authentication.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **Spot Account Management**: View balances, transaction history, deposit/withdrawal operations
- **Spot Trading**: Place orders (limit, market, stop), cancel orders, view order history and trades
- **Derivatives Trading**: Manage positions, transfers between spot and derivatives accounts
- **Margin Trading**: Borrow/repay funds, view loan and interest history
- **Market Data**: Access real-time tickers, order books, candlesticks, and instrument data
- **Wallet Operations**: Manage deposit addresses, withdrawals across multiple networks
- **HMAC-SHA256 Authentication**: Secure API authentication with proper signature generation
- **Comprehensive Error Handling**: All Crypto.com API error codes properly mapped

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-crypto-com-exchange`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-crypto-com-exchange
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-crypto-com-exchange.zip
cd n8n-nodes-crypto-com-exchange

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-crypto-com-exchange

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-crypto-com-exchange %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### Creating API Credentials

1. Log in to [Crypto.com Exchange](https://crypto.com/exchange)
2. Navigate to **Settings** > **API Management**
3. Create a new API key with the required permissions
4. Save both the API Key and Secret Key securely

### Configuring in n8n

| Field | Description |
|-------|-------------|
| API Key | Your Crypto.com Exchange API Key |
| API Secret | Your Crypto.com Exchange Secret Key |

**Note**: For security, store your API credentials securely and never share them.

## Resources & Operations

### Spot Account (7 operations)

| Operation | Description |
|-----------|-------------|
| Get Account Summary | Get all account balances |
| Get Account Balance | Get balance for a specific currency |
| Get Transaction History | List account transactions |
| Get Deposit Address | Get crypto deposit address |
| Create Withdrawal | Initiate a withdrawal |
| Get Withdrawal History | List withdrawals |
| Get Deposit History | List deposits |

### Spot Trading (7 operations)

| Operation | Description |
|-----------|-------------|
| Create Order | Place a new order (LIMIT, MARKET, STOP_LIMIT, etc.) |
| Cancel Order | Cancel an order by ID |
| Cancel All Orders | Cancel all open orders |
| Get Open Orders | List all open orders |
| Get Order Detail | Get details of a specific order |
| Get Order History | List historical orders |
| Get Trades | Get trade history |

### Derivatives (5 operations)

| Operation | Description |
|-----------|-------------|
| Get Positions | List all open positions |
| Get Position | Get a specific position |
| Close Position | Close an open position |
| Get Transfer History | List transfers between spot and derivatives |
| Transfer | Transfer funds between spot and derivatives |

### Margin (6 operations)

| Operation | Description |
|-----------|-------------|
| Get Margin Account | Get margin account details |
| Borrow | Borrow funds for margin trading |
| Repay | Repay margin loan |
| Get Loan History | List loan history |
| Get Interest History | List interest charges |
| Get Margin Trading User | Get margin trading user status |

### Market Data (7 operations)

| Operation | Description |
|-----------|-------------|
| Get Instruments | List all available trading pairs |
| Get Order Book | Get order book for an instrument |
| Get Ticker | Get ticker data for an instrument |
| Get All Tickers | Get ticker data for all instruments |
| Get Public Trades | Get recent public trades |
| Get Candlestick | Get OHLC candlestick data |
| Get Valuations | Get price valuations |

### Wallet (5 operations)

| Operation | Description |
|-----------|-------------|
| Get Currency Networks | Get available networks for a currency |
| Get Deposit Address | Generate a deposit address |
| Create Withdrawal | Initiate a withdrawal |
| Get Deposit History | List deposit history |
| Get Withdrawal History | List withdrawal history |

## Usage Examples

### Get Account Balance

```javascript
// Configure the node:
// Resource: Spot Account
// Operation: Get Account Summary
// Returns all currency balances
```

### Place a Limit Order

```javascript
// Configure the node:
// Resource: Spot Trading
// Operation: Create Order
// Instrument Name: BTC_USDT
// Side: BUY
// Type: LIMIT
// Quantity: 0.001
// Price: 40000
```

### Get Market Data

```javascript
// Configure the node:
// Resource: Market Data
// Operation: Get Candlestick
// Instrument Name: BTC_USDT
// Timeframe: 1h
// Options:
//   Count: 100
```

## API Concepts

### Instrument Names
Trading pairs are formatted as `BASE_QUOTE`, for example:
- `BTC_USDT` - Bitcoin/Tether
- `ETH_USDT` - Ethereum/Tether
- `CRO_USDT` - Cronos/Tether

### Order Types

| Type | Description |
|------|-------------|
| LIMIT | Order at a specific price |
| MARKET | Order at current market price |
| STOP_LIMIT | Limit order triggered at stop price |
| STOP_LOSS | Market order triggered at stop price |
| TAKE_PROFIT_LIMIT | Limit order triggered at take profit price |

### Time in Force

| Value | Description |
|-------|-------------|
| GTC | Good Till Cancelled |
| IOC | Immediate or Cancel |
| FOK | Fill or Kill |

### Candlestick Timeframes

Supported intervals: `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `6h`, `12h`, `1D`, `7D`, `14D`, `1M`

## Error Handling

The node handles all Crypto.com API error codes:

| Code | Description |
|------|-------------|
| 0 | Success |
| 10001 | System error |
| 10002 | Invalid request |
| 10004 | IP rate limit exceeded |
| 10005 | User rate limit exceeded |
| 10007 | Invalid signature |
| 20001 | Insufficient balance |
| 30003 | Invalid instrument_name |
| 40001 | Order not found |

## Security Best Practices

1. **API Key Permissions**: Only enable the permissions you need
2. **IP Whitelisting**: Restrict API access to specific IPs
3. **Credential Storage**: Use n8n's credential system, never hardcode
4. **Test Environment**: Test with small amounts first
5. **Rate Limiting**: Be aware of API rate limits to avoid blocks

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-crypto-com-exchange/issues)
- **Documentation**: [Crypto.com Exchange API](https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html)
- **Email**: support@velobpa.com

## Acknowledgments

- [Crypto.com](https://crypto.com) for their comprehensive Exchange API
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for their continued support
