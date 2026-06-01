export interface ExchangeApplication {
  firstName: string;
  lastName?: string;
  telegramUsername: string;
  country: string;
  city: string;
  userId?: number;
  createdAt: string;
}

export interface AMLCheckResult {
  address: string;
  asset: string;
  riskScore?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  signals: string[];
  hasBlacklistFlag: boolean;
  reportUrl?: string;
  status: 'success' | 'pending' | 'failed' | 'error';
}

export interface WebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}
