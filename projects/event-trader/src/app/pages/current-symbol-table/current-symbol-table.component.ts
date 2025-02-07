// FILEPATH: /Users/juzhongsun/Codes/javascripts/angular-utils/projects/event-trader/src/app/pages/current-symbol-table/current-symbol-table.component.ts

import { Component, effect, OnInit, signal } from '@angular/core';
import { FormController, FormItem, FrontendTableComponent, IColumn, SearchFormComponent } from '@wn-zorro';
import { formatDate } from '@wn-helper';
import { StrategySelectConfig, SymbolSelectData, SymbolSelectParam } from '../../types/strategy-select';
import { FetcherService } from '../../services/fetcher.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { NzIconService } from 'ng-zorro-antd/icon';
import { SelectOutline } from '@ant-design/icons-angular/icons';
import { ActionItem } from 'projects/wn-zorro/src/types/view';

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

  symbolFilters: SymbolSelectParam = {
    start_date: formatDate(),
    end_date: formatDate(),
    action: '',
    current_date: true,
  };

  items: FormItem[] = [];
  controller?: FormController;
  data: SymbolSelectData[] = [];
  columns: IColumn<SymbolSelectData>[] = [];

  constructor(
    private fetcher: FetcherService,
    private iconService: NzIconService
  ) {
    effect(() => {
      this.initColumn();
      this.initItems();
    });
    this.iconService.addIcon(SelectOutline);
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    try {
      const data = await this.fetcher.loadSymbolsSelects(this.symbolFilters);
      this.processData(data);
      const config = await this.fetcher.getStrategySelectsConfig();
      this.filterConfig.set(config);
    } catch (error) {
      console.error('Error initializing data:', error);
      // 这里可以添加错误处理逻辑，比如显示错误消息给用户
    }
  }

  private processData(data: SymbolSelectData[]) {
    for (const row of data) {
      for (const strategy of row.strategies) {
        row[strategy.strategy!] = strategy.action;
        row[strategy.action!] = (row[strategy.action!] ?? 0) + 1;
      }
      row['count'] = row.strategies.length;
    }
    this.data = data;
  }

  initItems() {
    this.items = [
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
    ];
    this.controller = {
      hides: [
        {
          field: 'current_date',
          rules: [
            {
              value: true,
              columns: ['action'],
            },
            {
              value: false,
              columns: ['date_range', 'action'],
            },
          ],
        },
      ],
    };
  }

  initColumn() {
    this.columns = [
      {
        name: 'symbol',
        title: '代码',
        type: 'text',
      },
      {
        name: 'Buy',
        title: '买入强度',
        type: 'text',
        sortFilter: {
          sortOrder: null,
          sortFn: (a: SymbolSelectData, b: SymbolSelectData) => a['Buy'] - b['Buy'],
          sortPriority: false,
          listOfFilter: this.numOptions(this.filterConfig().available_strategies?.length || 0),
          filterFn: (list: string[], item: SymbolSelectData) => list.some((value) => item['Buy'] === Number(value)),
          filterMultiple: true,
          sortDirections: ['ascend', 'descend'],
        },
      },
      {
        name: 'Sell',
        title: '卖出强度',
        type: 'text',
        sortFilter: {
          sortOrder: null,
          sortFn: (a: SymbolSelectData, b: SymbolSelectData) => a['Sell'] - b['Sell'],
          sortPriority: false,
          listOfFilter: this.numOptions(this.filterConfig().available_strategies?.length || 0),
          filterFn: (list: string[], item: SymbolSelectData) => list.some((value) => item['Sell'] === Number(value)),
          filterMultiple: true,
          sortDirections: ['ascend', 'descend'],
        },
      },
      {
        name: 'count',
        title: '信号量',
        type: 'text',
        sortFilter: {
          sortOrder: null,
          sortFn: (a: SymbolSelectData, b: SymbolSelectData) => a['count'] - b['count'],
          sortPriority: false,
          listOfFilter: this.numOptions(this.filterConfig().available_strategies?.length || 0),
          filterFn: (list: string[], item: SymbolSelectData) => list.some((value) => item['count'] === Number(value)),
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
    this.columns.push({
      name: 'actions',
      type: 'actions',
      params: {
        actions: [
          {
            icon: 'select',
            text: 'add symbol',
            click: (row: SymbolSelectData, act: ActionItem) => {
              console.log('hulalala', row, act);
            },
          },
        ],
      },
    });
  }

  private numOptions(len: number) {
    return Array.from({ length: len }, (_, i) => ({
      text: i.toString(),
      value: i,
    }));
  }

  onChange(row: any) {
    // 这里可以添加行变化时的逻辑
    console.log('Row changed:', row);
  }
}
