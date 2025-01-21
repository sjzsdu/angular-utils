import { Component, effect, OnInit, signal } from '@angular/core';
import { FrontendTableComponent, IColumn } from '@wn-zorro';
import { formatDate } from '@wn-helper';
import { StrategySelectConfig, StrategySelectData, StrategySelectParam } from '../../types/strategy-select';
import { FetcherService } from '../../services/fetcher.service';

@Component({
  selector: 'app-current-trade-table',
  standalone: true,
  imports: [FrontendTableComponent],
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

  constructor(private fetcher: FetcherService) {
    effect(() => {
      this.initColumn();
    });
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.data = await this.fetcher.loadStrategySelects(this.filters);
    const config = await this.fetcher.getStrategySelectsConfig();
    console.log('hullalal', config, this.data);
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
        name: 'strategy_info',
        title: '策略信息',
        type: 'text',
        params: {
          render: (record: StrategySelectData) => `${record.strategy_info.name} (${record.strategy_info.status})`,
        },
        width: '150px',
      },
      {
        name: 'remark',
        title: '备注',
        type: 'text',
        width: '150px',
      },
    ];
  }
}
