import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IrrigationService {
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
  private async upcomingPrecip(farm: any): Promise<number | null> {
    const c = await this.coordsFor(farm);
    if (!c) return null;
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&daily=precipitation_probability_max&timezone=auto&forecast_days=3`);
      const arr = ((await r.json())?.daily?.precipitation_probability_max || []).slice(0, 2).filter((x: any) => x != null);
      return arr.length ? Math.max(...arr) : null;
    } catch { return null; }
  }

  async getRecommendation(farmId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    const weather = await this.prisma.weatherData.findFirst({ where: { farmId }, orderBy: { recordedAt: 'desc' } });
    const last = await this.prisma.irrigationRecord.findFirst({ where: { farmId, isApplied: true }, orderBy: { appliedAt: 'desc' } });
    const precipSoon = await this.upcomingPrecip(farm);

    const temp = weather?.temperature ?? null;
    const soilMoisture = weather?.soilMoisture ?? null;
    const daysSince = last?.appliedAt ? Math.floor((Date.now() - new Date(last.appliedAt).getTime()) / 86400000) : null;

    const dryish = (soilMoisture != null && soilMoisture < 50) || (weather?.humidity != null && weather.humidity < 35) || (temp != null && temp > 30);
    const noRainSoon = precipSoon == null || precipSoon < 40;
    const overdue = daysSince == null || daysSince >= 3;
    const recommend = noRainSoon && overdue && (dryish || daysSince == null || daysSince >= 5);

    const method = (farm?.irrigationType as string) || 'DRIP';
    const depthMm = recommend ? (temp != null && temp > 32 ? 25 : 18) : 0;
    const areaHa = farm?.areaHa ?? 0;
    const volumeM3 = areaHa > 0 ? Math.round(depthMm * 10 * areaHa) : (recommend ? 12 : 0);
    const durationMin = recommend ? Math.max(20, Math.round(volumeM3 * 0.8)) : 0;
    const recommendedAt = (temp != null && temp > 30) ? '21:00' : '06:00';
    const confidence = Math.min(95, (weather ? 30 : 10) + (precipSoon != null ? 30 : 0) + (last ? 15 : 0) + (farm?.areaHa ? 10 : 0) + 10);

    const reasons: string[] = [];
    if (precipSoon != null) reasons.push(precipSoon < 40 ? `بارش ۴۸ساعت آینده کم (${precipSoon}٪)` : `بارش ۴۸ساعت آینده محتمل (${precipSoon}٪)`);
    if (daysSince != null) reasons.push(`${daysSince} روز از آخرین آبیاری`);
    if (soilMoisture != null) reasons.push(`رطوبت خاک ${Math.round(soilMoisture)}٪`);
    if (temp != null) reasons.push(`دمای هوا ${Math.round(temp)}°`);

    return {
      recommend, recommendedAt, method, amount: volumeM3, unit: 'm3', depthMm, duration: durationMin,
      confidence, soilMoisture: soilMoisture ?? 50, temperature: temp, precipSoon, daysSince,
      reason: recommend ? `آبیاری توصیه می‌شود — ${reasons.join('، ')}.` : `فعلاً آبیاری لازم نیست — ${reasons.join('، ') || 'شرایط مناسب است'}.`,
    };
  }

  async logAction(farmId: string, userId: string, data: any) {
    const scheduled = data?.scheduledAt ? new Date(data.scheduledAt) : null;
    const isFuture = !!(scheduled && scheduled.getTime() > Date.now());
    return this.prisma.irrigationRecord.create({
      data: {
        farmId, userId,
        amount: data.amount != null ? Number(data.amount) : null,
        duration: data.duration != null ? Number(data.duration) : null,
        method: (data.method as any) || undefined,
        notes: data.notes || undefined,
        scheduledAt: scheduled || undefined,
        isApplied: !isFuture,
        appliedAt: isFuture ? undefined : new Date(),
      },
    });
  }

  async getHistory(farmId: string) {
    return this.prisma.irrigationRecord.findMany({
      where: { farmId }, orderBy: [{ appliedAt: 'desc' }, { scheduledAt: 'desc' }], take: 30,
    });
  }
}
