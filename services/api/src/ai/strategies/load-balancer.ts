import { BaseAiProvider } from '../providers/base.provider';

export class LoadBalancer {
  private providers: BaseAiProvider[];

  constructor(providers: BaseAiProvider[]) {
    this.providers = providers.filter(p => p.isAvailable());
  }

  getAvailableProviders(): BaseAiProvider[] {
    return this.providers;
  }

  hasAnyAvailable(): boolean {
    return this.providers.length > 0;
  }
}
