const axios = require('axios');
const crypto = require('crypto');

class VeriffService {
  constructor() {
    this.apiKey = process.env.VERIFF_API_KEY || '336d071c-8cc7-419d-9bb6-7723fcbfe204';
    this.secretKey = process.env.VERIFF_SECRET_KEY || '227f05dc-92d6-4cfd-b94d-93a0064f500c';
    this.baseUrl = process.env.VERIFF_BASE_URL || 'https://stationapi.veriff.com';
  }

  // Генерація підпису для запиту
  generateSignature(payload) {
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    return signature.toLowerCase();
  }

  // Створити сесію верифікації
  async createSession(userId, userData) {
    try {
      const payload = {
        verification: {
          callback: `${process.env.API_URL || 'http://localhost:5000'}/api/kyc/veriff/webhook`,
          person: {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
          },
          vendorData: userId.toString(),
        }
      };

      // Серіалізуємо payload в JSON string
      const payloadString = JSON.stringify(payload);
      
      console.log('🔑 Veriff API Key:', this.apiKey);
      console.log('📦 Payload string:', payloadString);

      // Генеруємо підпис з JSON string
      const signature = crypto
        .createHmac('sha256', this.secretKey)
        .update(payloadString)
        .digest('hex')
        .toLowerCase();
        
      console.log('✍️ Signature:', signature);

      const response = await axios.post(
        `${this.baseUrl}/v1/sessions`,
        payloadString,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-AUTH-CLIENT': this.apiKey,
            'X-SIGNATURE': signature,
          }
        }
      );

      console.log('✅ Veriff Response:', response.data);

      return {
        sessionId: response.data.verification.id,
        url: response.data.verification.url,
        sessionToken: response.data.verification.sessionToken,
      };
    } catch (error) {
      console.error('❌ Veriff create session error:', error.response?.data || error.message);
      console.error('❌ Full error:', error);
      throw new Error('Failed to create Veriff session');
    }
  }

  // Отримати статус верифікації
  async getSessionStatus(sessionId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/sessions/${sessionId}`,
        {
          headers: {
            'X-AUTH-CLIENT': this.apiKey,
          }
        }
      );

      return {
        status: response.data.verification.status,
        code: response.data.verification.code,
        reason: response.data.verification.reason,
      };
    } catch (error) {
      console.error('Veriff get status error:', error.response?.data || error.message);
      throw new Error('Failed to get Veriff session status');
    }
  }

  // Перевірити webhook підпис
  verifyWebhookSignature(payload, signature) {
    const expectedSignature = this.generateSignature(payload);
    return expectedSignature === signature.toLowerCase();
  }

  // Обробити webhook
  async handleWebhook(payload, signature) {
    // Перевірка підпису
    if (!this.verifyWebhookSignature(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }

    const { status, verification } = payload;
    
    return {
      sessionId: verification.id,
      status: status,
      code: verification.code,
      reason: verification.reason,
      userId: verification.vendorData,
    };
  }

  // Маппінг статусів Veriff на наші
  mapStatus(veriffStatus) {
    const statusMap = {
      'approved': 'approved',
      'declined': 'rejected',
      'resubmission_requested': 'pending',
      'expired': 'rejected',
      'abandoned': 'rejected',
    };
    return statusMap[veriffStatus] || 'pending';
  }
}

module.exports = new VeriffService();
