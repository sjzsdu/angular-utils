export interface StrategySelectParam {
  start_date?: string;
  end_date?: string;
  symbol?: string;
  strategy?: string;
  action?: string;
  skip?: number;
  limit: number;
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

export interface StrategySelectConfig {
  available_strategies: string[];
  available_actions: string[];
}
