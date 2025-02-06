import { Component, effect, OnInit, signal } from '@angular/core';
import { FormItem, FrontendTableComponent, IColumn, SearchFormComponent } from '@wn-zorro';
import { formatDate } from '@wn-helper';
import {
  StrategySelectConfig,
  StrategySelectData,
  StrategySelectParam,
  SymbolSelectData,
  SymbolSelectParam,
} from '../../types/strategy-select';
import { FetcherService } from '../../services/fetcher.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { getISOWeek } from 'date-fns';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-current-symbol-table',
  standalone: true,
  imports: [FrontendTableComponent, SearchFormComponent, NzDatePickerModule, FormsModule],
  templateUrl: './current-symbol-table.component.html',
  styleUrl: './current-symbol-table.component.less',
})
export class CurrentSymbolTableComponent implements OnInit {
  filterConfig = signal<StrategySelectConfig>({
    available_strategies: [],
    available_actions: [],
  });
  filters: SymbolSelectParam = {
    start_date: formatDate(),
    end_date: formatDate(),
    action: '',
    current_date: true,
  };
  items: FormItem[] = [];

  constructor(private fetcher: FetcherService) {
    effect(() => {
      this.initColumn();
      this.initItems();
    });
  }

  ngOnInit(): void {
    this.init();
  }

  date = null;
  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }

  async init() {
    const data = await this.fetcher.loadSymbolsSelects(this.filters);
    for (const row of data) {
      for (const strategy of row.strategies) {
        row[strategy.strategy!] = strategy.action;
      }
      row['count'] = row.strategies.length;
    }
    this.data = data;
    const config = await this.fetcher.getStrategySelectsConfig();
    console.log('hullalal', config, this.data);
    this.filterConfig.set(config);
  }

  data: SymbolSelectData[] = [];
  columns: IColumn<SymbolSelectData>[] = [];

  initItems() {
    this.items = [
      {
        name: 'current_date',
        type: 'switch',
      },
      {
        name: 'action',
        type: 'select',
        params: {
          options: this.filterConfig().available_actions,
        },
      },
    ];
  }

  numOptions(len: number) {
    return Array.from({ length: len }, (_, i) => ({
      text: i.toString(),
      value: i,
    }));
  }

  initColumn() {
    this.columns = [
      {
        name: 'symbol',
        title: '代码',
        type: 'text',
      },
      {
        name: 'count',
        title: '买入强度',
        type: 'text',
        sortFilter: {
          sortOrder: null,
          sortFn: (a: SymbolSelectData, b: SymbolSelectData) => a['count'] - b['count'],
          sortPriority: false,
          listOfFilter: this.numOptions(this.filterConfig()?.available_strategies?.length),
          filterFn: (list: string[], item: SymbolSelectData) => list.some((value) => item['count'] === value),
          filterMultiple: true,
          sortDirections: ['ascend', 'descend'],
        },
      },
    ];
    this.filterConfig().available_strategies.forEach((strategy) => {
      this.columns.push({
        name: strategy,
        type: 'text',
      });
    });
  }

  onChange(row: any) {
    console.log('asdfadf', row);
  }
}
