import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WeatherService {
  private readonly apiKey = 'zpka_7f09d14536c942f6af7c8c15ab82346a_3a1a1b2b';
  private readonly baseUrl = 'https://dataservice.accuweather.com';

  constructor(private prisma: PrismaService) {}

  async getLocationKey(cityName: string): Promise<string | null> {
    try {
      const res = await fetch(
        `${this.baseUrl}/locations/v1/cities/search?apikey=${this.apiKey}&q=${encodeURIComponent(cityName)}&language=fa`,
        { headers: { 'Accept-Encoding': 'gzip' } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0].Key : null;
    } catch { return null; }
  }

  async getCurrentConditions(locationKey: string) {
    try {
      const res = await fetch(
        `${this.baseUrl}/currentconditions/v1/${locationKey}?apikey=${this.apiKey}&language=fa&details=true`,
        { headers: { 'Accept-Encoding': 'gzip' } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const c = data[0];
        return {
          temperature: c.Temperature?.Metric?.Value,
          humidity: c.RelativeHumidity,
          weatherText: c.WeatherText,
          weatherIcon: c.WeatherIcon,
          windSpeed: c.Wind?.Speed?.Metric?.Value,
          hasPrecipitation: c.HasPrecipitation,
        };
      }
      return null;
    } catch { return null; }
  }

  async getForecast(locationKey: string) {
    try {
      const res = await fetch(
        `${this.baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${this.apiKey}&language=fa&details=true&metric=true`,
        { headers: { 'Accept-Encoding': 'gzip' } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      if (data?.DailyForecasts) {
        return data.DailyForecasts.map((d: any) => ({
          date: d.Date,
          tempMin: d.Temperature?.Minimum?.Value,
          tempMax: d.Temperature?.Maximum?.Value,
          dayIcon: d.Day?.Icon,
          dayPhrase: d.Day?.ShortPhrase || d.Day?.LongPhrase,
          dayPrecipitation: d.Day?.PrecipitationProbability,
          nightPhrase: d.Night?.ShortPhrase,
          nightPrecipitation: d.Night?.PrecipitationProbability,
        }));
      }
      return [];
    } catch { return []; }
  }

  async getDashboardData(farmId: string, cityName: string) {
    try {
      const locKey = await this.getLocationKey(cityName);
      if (!locKey) return this.getFallbackDashboard(farmId);

      const [conditions, forecast] = await Promise.all([
        this.getCurrentConditions(locKey),
        this.getForecast(locKey),
      ]);

      if (conditions) {
        await this.prisma.weatherData.create({
          data: {
            farmId,
            temperature: conditions.temperature,
            humidity: conditions.humidity,
            windSpeed: conditions.windSpeed,
            precipitation: conditions.hasPrecipitation ? 1 : 0,
            source: 'accuweather',
            recordedAt: new Date(),
          },
        });
      }

      const lastIrrigation = await this.prisma.irrigationRecord.findFirst({
        where: { farmId, isApplied: true },
        orderBy: { appliedAt: 'desc' },
      });

      return {
        current: conditions || await this.getLatestFromDb(farmId),
        forecast: forecast || [],
        lastIrrigation: lastIrrigation ? { date: lastIrrigation.appliedAt, amount: lastIrrigation.amount, duration: lastIrrigation.duration } : null,
      };
    } catch {
      return this.getFallbackDashboard(farmId);
    }
  }

  async getLatestFromDb(farmId: string) {
    return this.prisma.weatherData.findFirst({
      where: { farmId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async getHistory(farmId: string, days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.prisma.weatherData.findMany({
      where: { farmId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'asc' },
    });
  }

  private async getFallbackDashboard(farmId: string) {
    const [latest, history, lastIrrigation] = await Promise.all([
      this.getLatestFromDb(farmId),
      this.prisma.weatherData.findMany({ where: { farmId }, orderBy: { recordedAt: 'asc' }, take: 7 }),
      this.prisma.irrigationRecord.findFirst({ where: { farmId, isApplied: true }, orderBy: { appliedAt: 'desc' } }),
    ]);

    return {
      current: latest,
      forecast: history.map(d => ({
        date: d.recordedAt, tempMin: d.temperature ? d.temperature - 5 : null,
        tempMax: d.temperature ? d.temperature + 5 : null,
        dayPhrase: 'بر اساس داده‌های قبلی',
        dayPrecipitation: d.precipitation ? Math.round(d.precipitation as number * 100) : null,
      })),
      lastIrrigation: lastIrrigation ? { date: lastIrrigation.appliedAt, amount: lastIrrigation.amount, duration: lastIrrigation.duration } : null,
    };
  }
}

