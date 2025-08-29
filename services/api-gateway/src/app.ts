import express from 'express';
import cors from 'cors';
import dashboardRouter from './routes/dashboard';
import fetch from 'node-fetch';

// Currency utilities - we'll implement these directly in the API gateway for now
interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  decimalPlaces: number;
  position: 'before' | 'after';
}

class CurrencyService {
  private static readonly currencyMap: Map<string, CurrencyInfo> = new Map([
    ['USD', { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2, position: 'before' }],
    ['EUR', { code: 'EUR', symbol: '€', name: 'Euro', decimalPlaces: 2, position: 'before' }],
    ['GBP', { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2, position: 'before' }],
    ['NGN', { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimalPlaces: 2, position: 'before' }],
    ['JPY', { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimalPlaces: 0, position: 'before' }],
    ['CAD', { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimalPlaces: 2, position: 'before' }],
    ['AUD', { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimalPlaces: 2, position: 'before' }],
    ['CHF', { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimalPlaces: 2, position: 'before' }],
    ['CNY', { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimalPlaces: 2, position: 'before' }],
    ['INR', { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalPlaces: 2, position: 'before' }],
    ['KRW', { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimalPlaces: 0, position: 'before' }],
    ['SGD', { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimalPlaces: 2, position: 'before' }],
    ['HKD', { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', decimalPlaces: 2, position: 'before' }],
    ['THB', { code: 'THB', symbol: '฿', name: 'Thai Baht', decimalPlaces: 2, position: 'before' }],
    ['MYR', { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', decimalPlaces: 2, position: 'before' }],
    ['IDR', { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', decimalPlaces: 0, position: 'before' }],
    ['PHP', { code: 'PHP', symbol: '₱', name: 'Philippine Peso', decimalPlaces: 2, position: 'before' }],
    ['SEK', { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', decimalPlaces: 2, position: 'after' }],
    ['NOK', { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', decimalPlaces: 2, position: 'after' }],
    ['DKK', { code: 'DKK', symbol: 'kr', name: 'Danish Krone', decimalPlaces: 2, position: 'after' }],
    ['PLN', { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', decimalPlaces: 2, position: 'after' }],
    ['CZK', { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', decimalPlaces: 2, position: 'after' }],
    ['HUF', { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimalPlaces: 0, position: 'after' }],
    ['RON', { code: 'RON', symbol: 'lei', name: 'Romanian Leu', decimalPlaces: 2, position: 'after' }],
    ['BGN', { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', decimalPlaces: 2, position: 'after' }],
    ['AED', { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimalPlaces: 2, position: 'before' }],
    ['SAR', { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', decimalPlaces: 2, position: 'before' }],
    ['QAR', { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', decimalPlaces: 2, position: 'before' }],
    ['KWD', { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', decimalPlaces: 3, position: 'before' }],
    ['BHD', { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', decimalPlaces: 3, position: 'before' }],
    ['OMR', { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', decimalPlaces: 3, position: 'before' }],
    ['BRL', { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimalPlaces: 2, position: 'before' }],
    ['MXN', { code: 'MXN', symbol: '$', name: 'Mexican Peso', decimalPlaces: 2, position: 'before' }],
    ['ARS', { code: 'ARS', symbol: '$', name: 'Argentine Peso', decimalPlaces: 2, position: 'before' }],
    ['CLP', { code: 'CLP', symbol: '$', name: 'Chilean Peso', decimalPlaces: 0, position: 'before' }],
    ['COP', { code: 'COP', symbol: '$', name: 'Colombian Peso', decimalPlaces: 0, position: 'before' }],
    ['PEN', { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', decimalPlaces: 2, position: 'before' }],
    ['UYU', { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', decimalPlaces: 2, position: 'before' }],
    ['RUB', { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimalPlaces: 2, position: 'after' }],
    ['TRY', { code: 'TRY', symbol: '₺', name: 'Turkish Lira', decimalPlaces: 2, position: 'after' }],
    ['ILS', { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', decimalPlaces: 2, position: 'before' }],
    ['ZAR', { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimalPlaces: 2, position: 'before' }],
    ['NZD', { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimalPlaces: 2, position: 'before' }],
  ]);

  static getCurrencyInfo(code: string): CurrencyInfo | null {
    const upperCode = code.toUpperCase();
    return this.currencyMap.get(upperCode) || null;
  }

  static getSymbol(code: string): string {
    const info = this.getCurrencyInfo(code);
    return info ? info.symbol : code;
  }

  static getName(code: string): string {
    const info = this.getCurrencyInfo(code);
    return info ? info.name : code;
  }

  static isSupported(code: string): boolean {
    return this.currencyMap.has(code.toUpperCase());
  }

  static getAllCurrencies(): CurrencyInfo[] {
    return Array.from(this.currencyMap.values());
  }

  static searchCurrencies(query: string): CurrencyInfo[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.currencyMap.values()).filter(
      (currency: CurrencyInfo) => 
        currency.code.toLowerCase().includes(lowerQuery) ||
        currency.name.toLowerCase().includes(lowerQuery) ||
        currency.symbol.toLowerCase().includes(lowerQuery)
    );
  }

  static formatAmount(amount: number, code: string, options: { showSymbol?: boolean; showCode?: boolean } = {}): string {
    const { showSymbol = true, showCode = false } = options;
    const info = this.getCurrencyInfo(code);
    
    if (!info) {
      return `${amount} ${code}`;
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: info.decimalPlaces,
      maximumFractionDigits: info.decimalPlaces,
    }).format(amount);

    let result = '';
    if (showSymbol) {
      if (info.position === 'before') {
        result = `${info.symbol}${formattedAmount}`;
      } else {
        result = `${formattedAmount} ${info.symbol}`;
      }
    } else {
      result = formattedAmount;
    }

    if (showCode) {
      result += ` ${info.code}`;
    }

    return result;
  }
}

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth:3001';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://event:3002';
const VENDOR_SERVICE_URL = process.env.VENDOR_SERVICE_URL || 'http://vendor:3003';
const INVOICE_SERVICE_URL = process.env.INVOICE_SERVICE_URL || 'http://invoice:3004';
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://email:3005';

const app = express();

// CORS configuration - MUST COME BEFORE OTHER MIDDLEWARE
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true,
}));

// Request logging middleware (should be first)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Body parsers for all routes with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Test endpoint to debug the issue
app.post('/api/test', (req, res) => {
  console.log('Test endpoint reached');
  res.json({ message: 'Test endpoint working' });
});

// Currency utility endpoints
app.get('/api/currency/symbol/:code', (req, res) => {
  const { code } = req.params;
  const symbol = CurrencyService.getSymbol(code);
  res.json({ 
    code: code.toUpperCase(), 
    symbol,
    supported: CurrencyService.isSupported(code)
  });
});

app.get('/api/currency/name/:code', (req, res) => {
  const { code } = req.params;
  const name = CurrencyService.getName(code);
  res.json({ 
    code: code.toUpperCase(), 
    name,
    supported: CurrencyService.isSupported(code)
  });
});

app.get('/api/currency/format', (req, res) => {
  const { amount, code, showSymbol = 'true', showCode = 'false' } = req.query;
  
  if (!amount || !code) {
    return res.status(400).json({ 
      error: 'Missing required parameters', 
      required: ['amount', 'code'],
      example: '/api/currency/format?amount=1000&code=USD&showSymbol=true&showCode=false'
    });
  }

  const numAmount = parseFloat(amount as string);
  if (isNaN(numAmount)) {
    return res.status(400).json({ error: 'Invalid amount parameter' });
  }

  const formatted = CurrencyService.formatAmount(numAmount, code as string, {
    showSymbol: showSymbol === 'true',
    showCode: showCode === 'true'
  });

  res.json({
    amount: numAmount,
    code: (code as string).toUpperCase(),
    formatted,
    supported: CurrencyService.isSupported(code as string)
  });
});

app.get('/api/currency/supported', (req, res) => {
  const currencies = CurrencyService.getAllCurrencies();
  res.json({
    count: currencies.length,
    currencies: currencies.map(c => ({
      code: c.code,
      symbol: c.symbol,
      name: c.name,
      decimalPlaces: c.decimalPlaces,
      position: c.position
    }))
  });
});

app.get('/api/currency/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ 
      error: 'Missing search query', 
      example: '/api/currency/search?q=dollar'
    });
  }

  const results = CurrencyService.searchCurrencies(q as string);
  res.json({
    query: q,
    count: results.length,
    results: results.map(c => ({
      code: c.code,
      symbol: c.symbol,
      name: c.name
    }))
  });
});

app.get('/api/currency/info/:code', (req, res) => {
  const { code } = req.params;
  const info = CurrencyService.getCurrencyInfo(code);
  
  if (!info) {
    return res.status(404).json({ 
      error: 'Currency not found', 
      code: code.toUpperCase(),
      message: 'This currency code is not supported. Use /api/currency/supported to see all supported currencies.'
    });
  }

  res.json({
    code: info.code,
    symbol: info.symbol,
    name: info.name,
    decimalPlaces: info.decimalPlaces,
    position: info.position,
    supported: true
  });
});

// Simple HTTP client forwarding for all services
app.use('/api/auth', async (req: express.Request, res: express.Response) => {
  try {
    const targetUrl = `${AUTH_SERVICE_URL}${req.url}`;
    console.log(`[${new Date().toISOString()}] Forwarding ${req.method} to auth: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(30000)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Auth service error:', error);
    res.status(502).json({ error: 'Service unavailable', details: error.message });
  }
});

app.use('/api/events', async (req: express.Request, res: express.Response) => {
  try {
    const targetUrl = `${EVENT_SERVICE_URL}/events${req.url}`;
    console.log(`[${new Date().toISOString()}] Forwarding ${req.method} to event: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(30000)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Event service error:', error);
    res.status(502).json({ error: 'Service unavailable', details: error.message });
  }
});

app.use('/api/vendors', async (req: express.Request, res: express.Response) => {
  try {
    const targetUrl = `${VENDOR_SERVICE_URL}${req.url}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(30000)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Vendor service error:', error);
    res.status(502).json({ error: 'Service unavailable', details: error.message });
  }
});

app.use('/api/invoices', async (req: express.Request, res: express.Response) => {
  try {
    const targetUrl = `${INVOICE_SERVICE_URL}${req.url}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(30000)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Invoice service error:', error);
    res.status(502).json({ error: 'Service unavailable', details: error.message });
  }
});

app.use('/api/email', async (req: express.Request, res: express.Response) => {
  try {
    const targetUrl = `${EMAIL_SERVICE_URL}${req.url}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(30000)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Email service error:', error);
    res.status(502).json({ error: 'Service unavailable', details: error.message });
  }
});

// Dashboard routes (aggregation functionality)
app.use('/api', dashboardRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

export default app; 