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
      + `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`
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
        temperature: c.temperature_2m, humidity: c.relative_humidity_2m, windSpeed: c.wind_speed_10m,
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

