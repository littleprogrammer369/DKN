import { BaseAiProvider } from '../providers/base.provider';
export class LoadBalancer {
  constructor(private providers: BaseAiProvider[]) {}
  getAvailableProviders(): BaseAiProvider[] { return this.providers.filter(p => p.isAvailable()); }
  hasAnyAvailable(): boolean { return this.providers.some(p => p.isAvailable()); }
}
