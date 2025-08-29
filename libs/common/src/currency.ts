export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  decimalPlaces: number;
  position: 'before' | 'after'; // Symbol position relative to amount
}

export class CurrencyService {
  private static readonly currencyMap: Map<string, CurrencyInfo> = new Map([
    // Major currencies
    ['USD', { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2, position: 'before' }],
    ['EUR', { code: 'EUR', symbol: '€', name: 'Euro', decimalPlaces: 2, position: 'before' }],
    ['GBP', { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2, position: 'before' }],
    ['JPY', { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimalPlaces: 0, position: 'before' }],
    ['CAD', { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimalPlaces: 2, position: 'before' }],
    ['AUD', { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimalPlaces: 2, position: 'before' }],
    ['CHF', { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimalPlaces: 2, position: 'before' }],
    ['CNY', { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimalPlaces: 2, position: 'before' }],
    
    // African currencies
    ['NGN', { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimalPlaces: 2, position: 'before' }],
    ['ZAR', { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimalPlaces: 2, position: 'before' }],
    ['EGP', { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', decimalPlaces: 2, position: 'before' }],
    ['KES', { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', decimalPlaces: 2, position: 'before' }],
    ['GHS', { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', decimalPlaces: 2, position: 'before' }],
    ['UGX', { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', decimalPlaces: 0, position: 'before' }],
    ['TZS', { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', decimalPlaces: 0, position: 'before' }],
    ['MAD', { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham', decimalPlaces: 2, position: 'before' }],
    
    // Asian currencies
    ['INR', { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalPlaces: 2, position: 'before' }],
    ['KRW', { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimalPlaces: 0, position: 'before' }],
    ['SGD', { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimalPlaces: 2, position: 'before' }],
    ['HKD', { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', decimalPlaces: 2, position: 'before' }],
    ['THB', { code: 'THB', symbol: '฿', name: 'Thai Baht', decimalPlaces: 2, position: 'before' }],
    ['MYR', { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', decimalPlaces: 2, position: 'before' }],
    ['IDR', { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', decimalPlaces: 0, position: 'before' }],
    ['PHP', { code: 'PHP', symbol: '₱', name: 'Philippine Peso', decimalPlaces: 2, position: 'before' }],
    
    // European currencies
    ['SEK', { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', decimalPlaces: 2, position: 'after' }],
    ['NOK', { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', decimalPlaces: 2, position: 'after' }],
    ['DKK', { code: 'DKK', symbol: 'kr', name: 'Danish Krone', decimalPlaces: 2, position: 'after' }],
    ['PLN', { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', decimalPlaces: 2, position: 'after' }],
    ['CZK', { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', decimalPlaces: 2, position: 'after' }],
    ['HUF', { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimalPlaces: 0, position: 'after' }],
    ['RON', { code: 'RON', symbol: 'lei', name: 'Romanian Leu', decimalPlaces: 2, position: 'after' }],
    ['BGN', { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', decimalPlaces: 2, position: 'after' }],
    
    // Middle Eastern currencies
    ['AED', { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimalPlaces: 2, position: 'before' }],
    ['SAR', { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', decimalPlaces: 2, position: 'before' }],
    ['QAR', { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', decimalPlaces: 2, position: 'before' }],
    ['KWD', { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', decimalPlaces: 3, position: 'before' }],
    ['BHD', { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', decimalPlaces: 3, position: 'before' }],
    ['OMR', { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', decimalPlaces: 3, position: 'before' }],
    
    // Latin American currencies
    ['BRL', { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimalPlaces: 2, position: 'before' }],
    ['MXN', { code: 'MXN', symbol: '$', name: 'Mexican Peso', decimalPlaces: 2, position: 'before' }],
    ['ARS', { code: 'ARS', symbol: '$', name: 'Argentine Peso', decimalPlaces: 2, position: 'before' }],
    ['CLP', { code: 'CLP', symbol: '$', name: 'Chilean Peso', decimalPlaces: 0, position: 'before' }],
    ['COP', { code: 'COP', symbol: '$', name: 'Colombian Peso', decimalPlaces: 0, position: 'before' }],
    ['PEN', { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', decimalPlaces: 2, position: 'before' }],
    ['UYU', { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', decimalPlaces: 2, position: 'before' }],
    
    // Other major currencies
    ['RUB', { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimalPlaces: 2, position: 'after' }],
    ['TRY', { code: 'TRY', symbol: '₺', name: 'Turkish Lira', decimalPlaces: 2, position: 'after' }],
    ['ILS', { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', decimalPlaces: 2, position: 'before' }],
    ['ZAR', { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimalPlaces: 2, position: 'before' }],
    ['NZD', { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimalPlaces: 2, position: 'before' }],
  ]);

  /**
   * Get currency information by ISO code
   * @param code - ISO 4217 currency code (e.g., 'USD', 'EUR')
   * @returns CurrencyInfo or null if not found
   */
  static getCurrencyInfo(code: string): CurrencyInfo | null {
    const upperCode = code.toUpperCase();
    return this.currencyMap.get(upperCode) || null;
  }

  /**
   * Get currency symbol by ISO code
   * @param code - ISO 4217 currency code (e.g., 'USD', 'EUR')
   * @returns Currency symbol or the code itself if not found
   */
  static getSymbol(code: string): string {
    const info = this.getCurrencyInfo(code);
    return info ? info.symbol : code;
  }

  /**
   * Get currency name by ISO code
   * @param code - ISO 4217 currency code (e.g., 'USD', 'EUR')
   * @returns Currency name or the code itself if not found
   */
  static getName(code: string): string {
    const info = this.getCurrencyInfo(code);
    return info ? info.name : code;
  }

  /**
   * Format amount with currency symbol
   * @param amount - Numeric amount
   * @param code - ISO 4217 currency code
   * @param options - Formatting options
   * @returns Formatted currency string
   */
  static formatAmount(
    amount: number, 
    code: string, 
    options: {
      showSymbol?: boolean;
      showCode?: boolean;
      locale?: string;
    } = {}
  ): string {
    const { showSymbol = true, showCode = false, locale = 'en-US' } = options;
    const info = this.getCurrencyInfo(code);
    
    if (!info) {
      // Fallback formatting if currency not found
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    // Custom formatting with proper symbol position
    const formattedAmount = new Intl.NumberFormat(locale, {
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

  /**
   * Get all supported currency codes
   * @returns Array of supported ISO currency codes
   */
  static getSupportedCurrencies(): string[] {
    return Array.from(this.currencyMap.keys());
  }

  /**
   * Check if a currency code is supported
   * @param code - ISO 4217 currency code
   * @returns True if supported, false otherwise
   */
  static isSupported(code: string): boolean {
    return this.currencyMap.has(code.toUpperCase());
  }

  /**
   * Get all currency information
   * @returns Array of all CurrencyInfo objects
   */
  static getAllCurrencies(): CurrencyInfo[] {
    return Array.from(this.currencyMap.values());
  }

  /**
   * Search currencies by name or code
   * @param query - Search query
   * @returns Array of matching CurrencyInfo objects
   */
  static searchCurrencies(query: string): CurrencyInfo[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.currencyMap.values()).filter(
      currency => 
        currency.code.toLowerCase().includes(lowerQuery) ||
        currency.name.toLowerCase().includes(lowerQuery) ||
        currency.symbol.toLowerCase().includes(lowerQuery)
    );
  }
}

// Convenience functions for common use cases
export const getCurrencySymbol = (code: string): string => CurrencyService.getSymbol(code);
export const getCurrencyName = (code: string): string => CurrencyService.getName(code);
export const formatCurrency = (amount: number, code: string, options?: any): string => 
  CurrencyService.formatAmount(amount, code, options);
export const isCurrencySupported = (code: string): boolean => CurrencyService.isSupported(code);
