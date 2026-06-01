export interface CreatePaymentResult {
  transactionId: string;
  redirectUrl: string;
}

export class PlategaService {
  private merchantId: string;
  private secret: string;

  constructor() {
    this.merchantId = process.env.PLATEGA_MERCHANT_ID || '';
    this.secret = process.env.PLATEGA_SECRET || '';
  }

  async createPayment(amountUsd: number, description: string): Promise<CreatePaymentResult> {
    console.log(`[PlategaService] Creating payment for $${amountUsd} - ${description}`);

    // TODO: Реальная интеграция с Platega API
    return {
      transactionId: `platega_${Date.now()}`,
      redirectUrl: `https://platega.io/pay/demo?amount=${amountUsd}`,
    };
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // TODO: Проверка подписи webhook от Platega
    return true;
  }
}
