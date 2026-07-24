import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  private apiKey: string;
  private sender: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KAVENEGAR_API_KEY || '';
    this.sender = process.env.KAVENEGAR_SENDER || '2000660110';
    this.baseUrl = 'https://api.kavenegar.com/v1';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async sendOtp(phone: string, code: string): Promise<boolean> {
    if (!this.isAvailable()) {
      console.log(`[SMS] No API key. OTP ${code} for ${phone} (not sent)`);
      return false;
    }

    const message = `داده کشت نوین\nکد تأیید شما: ${code}\nاین کد تا ۵ دقیقه معتبر است.`;

    try {
      const res = await fetch(
        `${this.baseUrl}/${this.apiKey}/sms/send.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            receptor: phone,
            sender: this.sender,
            message: message,
          }),
        }
      );
      const data = await res.json();
      if (data?.return?.status === 200) {
        console.log(`[SMS] ✓ OTP sent to ${phone}`);
        return true;
      }
      console.log(`[SMS] ✗ Failed for ${phone}: ${data?.return?.message || 'Unknown error'}`);
      return false;
    } catch (err: any) {
      console.log(`[SMS] ✗ Error for ${phone}: ${err.message}`);
      return false;
    }
  }
}