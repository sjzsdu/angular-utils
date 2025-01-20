import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FrontendTableComponent, IColumn } from '@wn-zorro';

interface TradeData {
  id: number;
  date: string;
  symbol: string;
  idx: string;
  strategy: string;
  action: string;
  price: number;
  last_trade_time: string;
  update_count: number;
  strategy_info: {
    data: Record<string, any>;
    name: string;
    profit: number;
    status: string;
    parameters: {
      window: number;
    };
    description: string;
  };
  remark: string | null;
}

@Component({
  selector: 'app-current-trade-table',
  standalone: true,
  imports: [FrontendTableComponent],
  templateUrl: './current-trade-table.component.html',
  styleUrl: './current-trade-table.component.less',
})
export class CurrentTradeTableComponent implements OnInit {
  constructor(private api: ApiService) {}

  filters = {
    start_date: '',
    end_date: '',
    symbol: '',
    strategy: '',
    action: '',
    skip: 0,
    limit: 100,
  };

  ngOnInit(): void {
    this.loadStrategySelects();
  }

  data: TradeData[] = [];

  loadStrategySelects(): void {
    const params = {
      start_date: this.filters.start_date,
      end_date: this.filters.end_date,
      symbol: this.filters.symbol,
      strategy: this.filters.strategy,
      action: this.filters.action,
      skip: this.filters.skip.toString(),
      limit: this.filters.limit.toString(),
    };

    this.api.get<TradeData[]>('strategy-selects/', { params }).subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (err) => {
        console.error('Failed to load strategy selects:', err);
      },
    });
  }
  columns: IColumn<TradeData>[] = [
    {
      name: 'id',
      type: 'text',
      params: {},
      width: '80px',
    },
    {
      name: 'date',
      title: '日期',
      type: 'text',
      params: {},
      width: '120px',
    },
    {
      name: 'symbol',
      title: '代码',
      type: 'text',
      params: {},
      width: '100px',
    },
    {
      name: 'idx',
      title: '指数',
      type: 'text',
      params: {},
      width: '100px',
    },
    {
      name: 'strategy',
      title: '策略',
      type: 'text',
      params: {},
      width: '120px',
    },
    {
      name: 'action',
      title: '操作',
      type: 'text',
      params: {},
      width: '80px',
    },
    {
      name: 'price',
      title: '价格',
      type: 'text',
      params: {},
      width: '80px',
    },
    {
      name: 'last_trade_time',
      title: '最后交易时间',
      type: 'text',
      params: {},
      width: '150px',
    },
    {
      name: 'update_count',
      title: '更新次数',
      type: 'text',
      params: {},
      width: '100px',
    },
    {
      name: 'strategy_info',
      title: '策略信息',
      type: 'text',
      params: {
        render: (record: TradeData) => `${record.strategy_info.name} (${record.strategy_info.status})`,
      },
      width: '150px',
    },
    {
      name: 'remark',
      title: '备注',
      type: 'text',
      params: {},
      width: '150px',
    },
  ];
}
