import { Component, effect, OnInit, signal } from '@angular/core';
import { FormController, FormItem, FrontendTableComponent, IColumn, SearchFormComponent } from '@wn-zorro';
import { formatDate, formatNumber } from '@wn-helper';
import { StrategySelectConfig, StrategySelectData, StrategySelectParam } from '../../types/strategy-select';
import { FetcherService } from '../../services/fetcher.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { format, getISOWeek } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { DATE_FORMAT } from '../../constant';
@Component({
  selector: 'app-current-trade-table',
  standalone: true,
  imports: [FrontendTableComponent, SearchFormComponent, NzDatePickerModule, FormsModule],
  templateUrl: './current-trade-table.component.html',
  styleUrl: './current-trade-table.component.less',
})
export class CurrentTradeTableComponent implements OnInit {
  filterConfig = signal<StrategySelectConfig>({
    available_strategies: [],
    available_actions: [],
  });
  filters: StrategySelectParam = {
    start_date: formatDate(),
    end_date: formatDate(),
    symbol: '',
    strategy: '',
    action: '',
    skip: 0,
    limit: 1000,
  };
  items: FormItem[] = [];
  controller?: FormController;

  constructor(private fetcher: FetcherService) {
    effect(() => {
      this.initColumn();
      this.initItems();
    });
  }

  initItems() {
    this.items = [
      {
        name: 'symbol',
        type: 'input',
      },
      {
        name: 'current_date',
        type: 'switch',
        defaults: true,
      },
      {
        name: 'date_range',
        type: 'dateRange',
        params: {},
      },
      {
        name: 'action',
        type: 'select',
        params: {
          options: this.filterConfig().available_actions,
        },
      },
      {
        name: 'strategy',
        type: 'select',
        params: {
          options: this.filterConfig().available_strategies,
        },
      },
    ];
    this.controller = {
      hides: [
        {
          field: 'current_date',
          rules: [
            {
              value: true,
              columns: ['symbol', 'action', 'strategy'],
            },
            {
              value: false,
              columns: ['date_range', 'symbol', 'action', 'strategy'],
            },
          ],
        },
      ],
    };
  }

  async ngOnInit() {
    await this.setConfig();
    await this.init();
  }

  date = null;
  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }

  async init() {
    const data = await this.fetcher.loadStrategySelects(this.filters);
    this.data = data.map((row) => {
      const { strategy_info, ...others } = row;
      row['parameters'] = strategy_info['parameters'];
      row['description'] = strategy_info['description'].trim();
      row['profit'] = formatNumber(strategy_info['profit']);
      return row;
    });
  }

  async setConfig() {
    const config = await this.fetcher.getStrategySelectsConfig();
    this.filterConfig.set(config);
  }

  data: StrategySelectData[] = [];
  columns: IColumn<StrategySelectData>[] = [];

  initColumn() {
    this.columns = [
      {
        name: 'date',
        title: '日期',
        type: 'text',
        width: '120px',
      },
      {
        name: 'symbol',
        title: '代码',
        type: 'text',
        width: '100px',
      },
      {
        name: 'idx',
        title: '指数',
        type: 'text',
        width: '100px',
      },
      {
        name: 'strategy',
        title: '策略',
        type: 'text',
        width: '120px',
        sortFilter: {
          sortOrder: null,
          sortFn: (a: StrategySelectData, b: StrategySelectData) => a.strategy.localeCompare(b.strategy),
          sortPriority: false,
          listOfFilter: this.filterConfig()?.available_strategies?.map((s) => ({ text: s, value: s })) || [],
          filterFn: (list: string[], item: StrategySelectData) => list.some((value) => item.strategy === value),
          filterMultiple: true,
          sortDirections: ['ascend', 'descend'],
        },
      },
      {
        name: 'action',
        title: '方向',
        type: 'text',
        width: '80px',
        sortFilter: {
          sortOrder: null,
          sortFn: (a: StrategySelectData, b: StrategySelectData) => a.action.localeCompare(b.action),
          sortPriority: false,
          listOfFilter: this.filterConfig().available_actions?.map((a) => ({ text: a, value: a })) || [],
          filterFn: (list: string[], item: StrategySelectData) => list.some((value) => item.action === value),
          filterMultiple: true,
          sortDirections: ['ascend', 'descend'],
        },
      },
      {
        name: 'price',
        title: '价格',
        type: 'text',
        width: '80px',
      },
      {
        name: 'last_trade_time',
        title: '最后交易时间',
        type: 'text',
        width: '150px',
      },
      {
        name: 'update_count',
        title: '买入机会',
        type: 'text',
        width: '100px',
      },
      {
        name: 'description',
        title: '策略信息',
        type: 'text',
      },
      {
        name: 'parameters',
        title: '策略参数',
        type: 'json',
      },
      {
        name: 'profit',
        title: '近一年预期盈利',
        type: 'text',
      },
    ];
  }

  onChange(row: any) {
    const { current_date, date_range, ...others } = row;
    if (current_date) {
      this.filters.start_date = formatDate();
      this.filters.end_date = formatDate();
    } else if (date_range) {
      this.filters.start_date = format(date_range[0], DATE_FORMAT);
      this.filters.end_date = format(date_range[1], DATE_FORMAT);
    }
    Object.assign(this.filters, others);
    this.init();
  }
}
