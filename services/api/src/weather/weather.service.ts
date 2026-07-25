import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const WMO: Record<number, { fa: string }> = {
  0: { fa: 'آسمان صاف' }, 1: { fa: 'قسمتاً صاف' }, 2: { fa: 'نیمه‌ابری' }, 3: { fa: 'ابری' },
  45: { fa: 'مه' }, 48: { fa: 'مه یخ‌زده' },
  51: { fa: 'نم‌نم باران' }, 53: { fa: 'نم‌نم باران' }, 55: { fa: 'نم‌نم باران شدید' },
  56: { fa: 'باران یخ‌زده' }, 57: { fa: 'باران یخ‌زده' },
  61: { fa: 'باران خفیف' }, 63: { fa: 'باران' }, 65: { fa: 'باران شدید' }, 66: { fa: 'باران یخ‌زده' }, 67: { fa: 'باران یخ‌زده شدید' },
  71: { fa: 'برف خفیف' }, 73: { fa: 'برف' }, 75: { fa: 'برف شدید' }, 77: { fa: 'دانه‌های برف' },
  80: { fa: 'رگبار خفیف' }, 81: { fa: 'رگبار' }, 82: { fa: 'رگبار شدید' }, 85: { fa: 'بارش برف' }, 86: { fa: 'بارش برف شدید' },
  95: { fa: 'رعدوبرق' }, 96: { fa: 'رعدوبرق و تگرگ' }, 99: { fa: 'رعدوبرق و تگرگ شدید' },
};
const wmoText = (code?: number | null) => (code == null ? '—' : WMO[code]?.fa ?? '—');

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}

  private boundaryCentroid(boundary: any): { lat: number; lng: number } | null {
    if (!Array.isArray(boundary) || boundary.length < 3) return null;
    let lat = 0, lng = 0, n = 0;
    for (const p of boundary) {
      if (Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number') { lat += p[0]; lng += p[1]; n++; }
    }
    return n ? { lat: lat / n, lng: lng / n } : null;
  }
  private coordsFromGeojson(geojson: any): { lat: number; lng: number } | null {
    if (!geojson) return null;
    try {
      const coords = geojson.type === 'Polygon' ? geojson.coordinates?.[0]
        : geojson.type === 'MultiPolygon' ? geojson.coordinates?.[0]?.[0] : null;
      if (coords && Array.isArray(coords) && coords.length > 0) {
        const sum = coords.reduce((acc: [number, number], c: number[]) => [acc[0] + c[0], acc[1] + c[1]], [0, 0]);
        return { lng: sum[0] / coords.length, lat: sum[1] / coords.length };
      }
      if (geojson.type === 'Point' && Array.isArray(geojson.coordinates)) return { lng: geojson.coordinates[0], lat: geojson.coordinates[1] };
    } catch { /* ignore */ }
    return null;
  }
  private async coordsFor(farm: any): Promise<{ lat: number; lng: number } | null> {
    const fromBoundary = this.boundaryCentroid(farm?.boundary);
    if (fromBoundary) return fromBoundary;
    if (farm?.lat != null && farm?.lng != null) return { lat: farm.lat, lng: farm.lng };
    const fromGeo = this.coordsFromGeojson(farm?.geojson);
    if (fromGeo) return fromGeo;
    const city = farm?.city || farm?.province;
    if (!city) return null;
    try {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fa`);
      const g = (await r.json())?.results?.[0];
      return g ? { lat: g.latitude, lng: g.longitude } : null;
    } catch { return null; }
  }

  private async fetchForecast(lat: number, lng: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}`
      + `&current=temperature_2m,apparent_temperature,is_day,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum`
      + `&timezone=auto&forecast_days=6&wind_speed_unit=kmh`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('open-meteo failed');
    return r.json();
  }

  async getLiveCurrentAndForecast(farm: any) {
    const coords = await this.coordsFor(farm);
    if (!coords) return { current: null, forecast: [] as any[] };
    try {
      const d = await this.fetchForecast(coords.lat, coords.lng);
      const c = d.current || {};
      const current = {
        temperature: c.temperature_2m, apparentTemperature: c.apparent_temperature, isDay: c.is_day,
        humidity: c.relative_humidity_2m, windSpeed: c.wind_speed_10m,
        precipitation: c.precipitation, weatherCode: c.weather_code, weatherText: wmoText(c.weather_code),
      };
      const daily = d.daily || {};
      const forecast = (daily.time || []).map((t: string, i: number) => ({
        date: t, tempMax: daily.temperature_2m_max?.[i], tempMin: daily.temperature_2m_min?.[i],
        dayPrecipitation: daily.precipitation_probability_max?.[i], weatherCode: daily.weather_code?.[i],
        dayPhrase: wmoText(daily.weather_code?.[i]),
      }));
      return { current, forecast };
    } catch { return { current: null, forecast: [] as any[] }; }
  }

  async getDashboardData(farmId: string, _city?: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    const { current, forecast } = farm ? await this.getLiveCurrentAndForecast(farm) : { current: null, forecast: [] };
    if (current && farm) {
      await this.prisma.weatherData.create({
        data: { farmId, temperature: current.temperature, humidity: current.humidity, windSpeed: current.windSpeed, precipitation: current.precipitation, source: 'open-meteo', recordedAt: new Date() },
      }).catch(() => {});
    }
    const last = await this.prisma.irrigationRecord.findFirst({ where: { farmId, isApplied: true }, orderBy: { appliedAt: 'desc' } });
    const lastIrr = last ? { date: last.appliedAt, amount: last.amount, duration: last.duration } : null;
    if (current) return { current, forecast, lastIrrigation: lastIrr };
    return this.getFallbackDashboard(farmId);
  }

  async getLatestFromDb(farmId: string) {
    return this.prisma.weatherData.findFirst({ where: { farmId }, orderBy: { recordedAt: 'desc' } });
  }
  async getHistory(farmId: string, days = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.prisma.weatherData.findMany({ where: { farmId, recordedAt: { gte: since } }, orderBy: { recordedAt: 'asc' } });
  }
  private async fetchArchive(lat: number, lng: number) {
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const end = new Date(Date.now() - 864e5), start = new Date(Date.now() - 30 * 864e5);
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${fmt(start)}&end_date=${fmt(end)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto`;
    const r = await fetch(url); if (!r.ok) throw new Error('archive failed'); return r.json();
  }

  async getPanel(userId: string, farmId: string) {
    const IRR_FA: Record<string, string> = { DRIP: 'قطره‌ای', SPRINKLER: 'بارانی', SURFACE: 'سطحی', SUBSURFACE: 'زیرزمینی' };
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) return { error: 'farm-not-found' };
    const { current, forecast } = await this.getLiveCurrentAndForecast(farm);

    let series: { date: string; tmax: number | null; tmin: number | null; precip: number | null; humidity: number | null }[] = [];
    const coords = await this.coordsFor(farm);
    if (coords) {
      try {
        const a = await this.fetchArchive(coords.lat, coords.lng); const d = a?.daily || {};
        series = (d.time || []).map((t: string, i: number) => ({ date: t, tmax: d.temperature_2m_max?.[i] ?? null, tmin: d.temperature_2m_min?.[i] ?? null, precip: d.precipitation_sum?.[i] ?? null, humidity: d.relative_humidity_2m_mean?.[i] ?? null }));
      } catch {}
    }
    if (series.length === 0) {
      const h = await this.prisma.weatherData.findMany({ where: { farmId }, orderBy: { recordedAt: 'asc' }, take: 30 });
      series = h.map((x: any) => ({ date: x.recordedAt ? new Date(x.recordedAt).toISOString().slice(0, 10) : '', tmax: x.temperature, tmin: x.temperature, precip: x.precipitation, humidity: x.humidity }));
    }
    const valid = series.filter(s => s.tmax != null);
    const seriesStats = valid.length ? {
      minTemp: Math.min(...valid.map(s => s.tmin ?? s.tmax!)),
      maxTemp: Math.max(...valid.map(s => s.tmax!)),
      avgTemp: Math.round((valid.reduce((a, s) => a + ((s.tmax! + (s.tmin ?? s.tmax!)) / 2), 0) / valid.length) * 10) / 10,
      rainyDays: series.filter(s => (s.precip ?? 0) >= 1).length,
    } : null;

    const [satLatest, satTrend, irrLast, pestsActive, pestsHigh, farmsCount, latestPest] = await Promise.all([
      this.prisma.satelliteData.findFirst({ where: { farmId }, orderBy: { capturedAt: 'desc' } }),
      this.prisma.satelliteData.findMany({ where: { farmId }, orderBy: { capturedAt: 'asc' }, take: 12, select: { capturedAt: true, ndvi: true, evi: true } }),
      this.prisma.irrigationRecord.findFirst({ where: { farmId, isApplied: true }, orderBy: { appliedAt: 'desc' } }),
      this.prisma.pestReport.count({ where: { farmId, isActive: true } }),
      this.prisma.pestReport.count({ where: { farmId, isActive: true, severity: { in: ['HIGH', 'CRITICAL'] } } }),
      this.prisma.farm.count({ where: { userId, isActive: true } }),
      this.prisma.pestReport.findFirst({ where: { farmId, isActive: true }, orderBy: { detectedAt: 'desc' } }),
    ]);
    const cycleDays = 7;
    const daysSince = irrLast?.appliedAt ? Math.floor((Date.now() - new Date(irrLast.appliedAt).getTime()) / 864e5) : null;
    const ndvi = satLatest?.ndvi ?? null;
    const healthScore = ndvi != null ? Math.max(0, Math.min(100, Math.round(ndvi * 100))) : (pestsHigh > 0 ? 40 : current ? 70 : null);

    const alerts: { severity: 'danger' | 'warning' | 'info'; title: string; body: string }[] = [];
    if (current?.temperature != null && current.temperature >= 35) alerts.push({ severity: 'danger', title: 'تنش گرمایی', body: 'دمای بالا؛ آبیاری را به غروب منتقل کنید.' });
    if (current?.humidity != null && current.humidity >= 70) alerts.push({ severity: 'warning', title: 'ریسک بیماری قارچی', body: 'رطوبت بالا؛ برگ‌ها را پایش کنید.' });
    if (daysSince != null && daysSince >= cycleDays) alerts.push({ severity: 'info', title: 'زمان آبیاری فرا رسیده', body: `${daysSince} روز از آخرین آبیاری گذشته.` });
    if (ndvi != null && ndvi < 0.3) alerts.push({ severity: 'warning', title: 'افت پوشش گیاهی', body: 'شاخص NDVI پایین است.' });
    if (pestsHigh > 0) alerts.push({ severity: 'danger', title: 'گزارش آفت شدید فعال', body: 'اقدام فوری توصیه می‌شود.' });

    let recommendation = { label: 'توصیه هوش مصنوعی', title: 'وضعیت مزرعه پایدار است', body: 'در حال حاضر اقدام فوری لازم نیست.' };
    if (daysSince != null && daysSince >= cycleDays) recommendation = { label: 'توصیه هوش مصنوعی', title: `آبیاری ${IRR_FA[farm.irrigationType as any] || ''}؛ زودتر از موعد پیشنهاد می‌شود`, body: `${daysSince} روز از آخرین آبیاری گذشته است.` };
    else if (pestsHigh > 0) recommendation = { label: 'توصیه هوش مصنوعی', title: 'بررسی فوری آفت فعال', body: 'گزارش آفت با شدت بالا ثبت شده است.' };
    else if (current?.humidity != null && current.humidity >= 70) recommendation = { label: 'توصیه هوش مصنوعی', title: 'سم‌پاشی پیشگیرانه توصیه می‌شود', body: 'رطوبت بالا ریسک قارچ را افزایش داده.' };
    else if (current?.temperature != null && current.temperature >= 35) recommendation = { label: 'توصیه هوش مصنوعی', title: 'آبیاری را به غروب منتقل کنید', body: 'خطر تنش گرمایی.' };
    else if (ndvi != null && ndvi < 0.3) recommendation = { label: 'توصیه هوش مصنوعی', title: 'بررسی سلامت پوشش گیاهی', body: 'NDVI پایین‌تر از حد مطلوب.' };

    return {
      farm: { id: farm.id, name: farm.name, product: farm.product, city: farm.city, province: farm.province, areaHa: farm.areaHa, irrigationType: farm.irrigationType },
      current, forecast, series, seriesStats, healthScore, recommendation,
      satellite: { latest: satLatest ? { ndvi: satLatest.ndvi, evi: satLatest.evi, ndwi: satLatest.ndwi, msi: satLatest.msi, capturedAt: satLatest.capturedAt } : null, trend: satTrend.map((s: any) => ({ date: s.capturedAt, ndvi: s.ndvi, evi: s.evi })) },
      irrigation: { last: irrLast ? { date: irrLast.appliedAt, amount: irrLast.amount, duration: irrLast.duration } : null, daysSince, cycleDays },
      pests: { active: pestsActive, highOrCritical: pestsHigh, latest: latestPest ? { name: latestPest.pestName, severity: latestPest.severity, date: latestPest.detectedAt } : null },
      kpis: { farmsCount, openPests: pestsActive, ndvi },
      alerts,
    };
  }

  private async getFallbackDashboard(farmId: string) {
    const [latest, history, last] = await Promise.all([
      this.getLatestFromDb(farmId),
      this.prisma.weatherData.findMany({ where: { farmId }, orderBy: { recordedAt: 'asc' }, take: 7 }),
      this.prisma.irrigationRecord.findFirst({ where: { farmId, isApplied: true }, orderBy: { appliedAt: 'desc' } }),
    ]);
    return {
      current: latest,
      forecast: history.map((d: any) => ({ date: d.recordedAt, tempMin: d.temperature ? d.temperature - 5 : null, tempMax: d.temperature ? d.temperature + 5 : null, dayPhrase: 'بر اساس داده‌های قبلی', dayPrecipitation: d.precipitation ? Math.round((d.precipitation as number) * 100) : null })),
      lastIrrigation: last ? { date: last.appliedAt, amount: last.amount, duration: last.duration } : null,
    };
  }
}

