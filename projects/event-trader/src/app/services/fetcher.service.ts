import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StrategySelectConfig, StrategySelectData, StrategySelectParam } from '../types/strategy-select';
import { lastValueFrom } from 'rxjs';
import { memoize, removeEmptyKeys } from '@wn-helper';

@Injectable({
  providedIn: 'root',
})
export class FetcherService {
  constructor(private api: ApiService) {}

  loadStrategySelects(params: StrategySelectParam): Promise<StrategySelectData[]> {
    return lastValueFrom(this.api.get<StrategySelectData[]>('strategy-selects/', removeEmptyKeys(params)));
  }

  @memoize
  getStrategySelectsConfig(): Promise<StrategySelectConfig> {
    return lastValueFrom(this.api.get<StrategySelectConfig>('config/'));
  }
}
