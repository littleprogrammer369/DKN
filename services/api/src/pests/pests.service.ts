import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePestDto, UpdatePestDto } from './dto/pest.dto';

@Injectable()
export class PestsService {
  constructor(private prisma: PrismaService) {}

  // ---- legacy (kept) ----
  async getActiveThreats(farmId: string) { return this.prisma.pestReport.findMany({ where: { farmId, isActive: true }, orderBy: { detectedAt: 'desc' } }); }
  async getRiskLevel(farmId: string) {
    const t = await this.prisma.pestReport.findMany({ where: { farmId, isActive: true } });
    return { pestRisk: Math.min(t.filter(x => x.pestType === 'آفت').length * 15, 100), diseaseRisk: Math.min(t.filter(x => x.pestType === 'بیماری').length * 20, 100), weedRisk: Math.min(t.filter(x => x.pestType === 'علف هرز').length * 10, 100), activeThreats: t.length };
  }

  private async own(id: string, farmId: string, userId: string) {
    const r = await this.prisma.pestReport.findFirst({ where: { id, farmId, userId } });
    if (!r) throw new NotFoundException('گزارش یافت نشد');
    return r;
  }

  async create(farmId: string, userId: string, d: CreatePestDto) {
    return this.prisma.pestReport.create({ data: { farmId, userId, pestName: d.pestName, pestType: d.category || 'سایر', severity: d.severity as any, description: d.description, chemical: d.chemical, image: d.image, probability: d.probability, detectedAt: d.detectedAt ? new Date(d.detectedAt) : new Date(), isActive: true } });
  }
  async update(id: string, farmId: string, userId: string, d: UpdatePestDto) {
    await this.own(id, farmId, userId);
    const data: any = {};
    if (d.pestName !== undefined) data.pestName = d.pestName;
    if (d.category !== undefined) data.pestType = d.category;
    if (d.severity !== undefined) data.severity = d.severity as any;
    if (d.description !== undefined) data.description = d.description;
    if (d.chemical !== undefined) data.chemical = d.chemical;
    if (d.image !== undefined) data.image = d.image;
    if (d.probability !== undefined) data.probability = d.probability;
    return this.prisma.pestReport.update({ where: { id }, data });
  }
  async remove(id: string, farmId: string, userId: string) { await this.own(id, farmId, userId); return this.prisma.pestReport.update({ where: { id }, data: { isActive: false } }); }
  async list(farmId: string, userId: string) { return this.prisma.pestReport.findMany({ where: { farmId, userId, isActive: true }, orderBy: { detectedAt: 'desc' } }); }
  async view(id: string, farmId: string, userId: string) { return this.own(id, farmId, userId); }
  async all(userId: string) { return this.prisma.pestReport.findMany({ where: { userId, isActive: true }, orderBy: { detectedAt: 'desc' }, include: { farm: { select: { id: true, name: true, product: true } } } }); }

  // ---- weather-based risk + preventive alerts ----
  async assessment(farmId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    const w = await this.prisma.weatherData.findFirst({ where: { farmId }, orderBy: { recordedAt: 'desc' } });
    const reports = await this.prisma.pestReport.findMany({ where: { farmId, isActive: true } });
    const temp = w?.temperature ?? null, hum = w?.humidity ?? null;
    const lvl = (v: number, hi: number, med: number) => v >= hi ? 'high' : v >= med ? 'medium' : 'low';
    const heat = { level: temp == null ? 'unknown' : lvl(temp, 35, 30), reason: temp == null ? 'داده دما موجود نیست' : temp >= 35 ? `دمای ${Math.round(temp)}° — تنش گرمایی محتمل` : temp >= 30 ? `دمای ${Math.round(temp)}° — مراقب آفات گرمادوست باشید` : 'دمای هوا در محدوده امن' };
    const fungal = { level: hum == null ? 'unknown' : lvl(hum, 70, 55), reason: hum == null ? 'داده رطوبت موجود نیست' : hum >= 70 ? `رطوبت ${Math.round(hum)}٪ — شرایط مساعد برای قارچ/بلست/سفیدک` : hum >= 55 ? `رطوبت ${Math.round(hum)}٪ — ریسک قارچی متوسط` : 'رطوبت پایین — ریسک قارچی کم' };
    const byCat: Record<string, number> = {};
    for (const r of reports) { const k = r.pestType || ""; byCat[k] = (byCat[k] || 0) + 1; }
    const alerts: { severity: 'danger' | 'warning' | 'info'; title: string; body: string }[] = [];
    if (heat.level === 'high') alerts.push({ severity: 'danger', title: 'تنش گرمایی', body: 'دمای بالا خطر تنش و طغیان آفات را افزایش می‌دهد؛ آبیاری را به غروب/صبح زود منتقل کنید و تنش رطوبتی ندهید.' });
    if (fungal.level === 'high') alerts.push({ severity: 'warning', title: 'خطر بیماری قارچی', body: 'رطوبت بالا زمینه را برای زنگ/سفیدک/بلست فراهم کرده؛ برگ‌ها را پایش و در صورت نیاز سم‌پاشی پیشگیرانه کنید.' });
    if (reports.some(r => r.severity === 'HIGH' || r.severity === 'CRITICAL')) alerts.push({ severity: 'danger', title: 'گزارش فعال با شدت بالا', body: 'یک یا چند گزارش شدید/بحرانی باز است؛ بررسی و اقدام فوری توصیه می‌شود.' });
    return { farm: farm ? { id: farm.id, name: farm.name, crop: farm.product } : null, heat, fungal, activeByCategory: byCat, activeThreats: reports.length, alerts };
  }

  // ---- AI vision (Gemini multimodal) ----
  async detect(image: string, mimeType: string | undefined, farmId: string | undefined) {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!key) return null;
    const farm = farmId ? await this.prisma.farm.findUnique({ where: { id: farmId } }) : null;
    const crop = farm?.product || 'نامشخص';
    const raw = image.includes(',') ? image.split(',')[1] : image;
    const mime = mimeType || (image.startsWith('data:') ? (image.match(/^data:([^;]+)/)?.[1] || 'image/jpeg') : 'image/jpeg');
    const model = process.env.GEMINI_MODEL_VISION || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const prompt = `You are an expert plant pathologist for Iranian crops. Look at this crop photo (crop context: ${crop}). Identify the most likely pest or disease. Respond ONLY with strict JSON (no markdown): {"pestName":"<Persian name>","category":"<one of: حشرات|قارچ و بیماری|کنه|ویروس|علف هرز|کمبود تغذیه|سایر>","severity":"<LOW|MEDIUM|HIGH|CRITICAL>","confidence":<0-100>,"description":"<Persian, 1-2 lines>","treatment":"<Persian short recommendation>","chemical":"<Persian, optional active ingredient>"}.`;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ inline_data: { mime_type: mime, data: raw } }, { text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 600, responseMimeType: 'application/json' } }),
      });
      if (!res.ok) { console.log('[PESTS-VISION] HTTP', res.status); return null; }
      const data = await res.json();
      const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const m = txt.match(/\{[\s\S]*\}/); const o = m ? JSON.parse(m[0]) : null; if (!o) return null;
      const sev = String(o.severity || '').toUpperCase();
      return { pestName: o.pestName || '', category: o.category || 'سایر', severity: (['LOW','MEDIUM','HIGH','CRITICAL'] as any).includes(sev) ? sev : 'MEDIUM', confidence: Number(o.confidence) || 0, description: o.description || '', treatment: o.treatment || '', chemical: o.chemical || '' };
    } catch (e: any) { console.log('[PESTS-VISION] error', e.message); return null; }
  }
}
