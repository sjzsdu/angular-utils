export interface StrategySelectParam {
  start_date?: string;
  end_date?: string;
  symbol?: string;
  strategy?: string;
  action?: string;
  skip?: number;
  limit: number;
}
export interface IStrategyInfo {
  data: Record<string, any>;
  name: string;
  profit: number;
  status: string;
  parameters: {
    window: number;
  };
  description: string;
  strategy?: string;
  action?: string;
}
export interface StrategySelectData {
  id: number;
  date: string;
  symbol: string;
  idx: string;
  strategy: string;
  action: string;
  price: number;
  last_trade_time: string;
  update_count: number;
  strategy_info: IStrategyInfo;
  remark: string | null;
}

export interface SymbolSelectParam {
  start_date?: string;
  end_date?: string;
  action?: string;
  current_date?: boolean;
}

export interface SymbolSelectData {
  symbol: string;
  stock_info: any;
  strategies: IStrategyInfo[];
  [key: string]: any;
}

export interface StrategySelectConfig {
  available_strategies: string[];
  available_actions: string[];
}
