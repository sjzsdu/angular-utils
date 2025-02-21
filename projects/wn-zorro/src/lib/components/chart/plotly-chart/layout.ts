// FILEPATH: /Users/juzhongsun/Codes/javascripts/angular-utils/projects/wn-zorro/src/lib/components/chart/plotly-chart/layout.ts

import { Layout } from 'plotly.js-dist-min';

const defaultLayout: Record<string, Partial<Layout>> = {
  common: {
    margin: { t: 50, r: 50, b: 50, l: 50 },
    font: { family: 'Arial, sans-serif' },
    showlegend: true,
    legend: { orientation: 'h', y: -0.2 },
  },
  bar: {
    barmode: 'group',
    bargap: 0.15,
    bargroupgap: 0.1,
  },
  line: {
    hovermode: 'closest',
    xaxis: { showgrid: false },
    yaxis: { showgrid: true },
  },
  scatter: {
    hovermode: 'closest',
    xaxis: { showgrid: false },
    yaxis: { showgrid: true },
  },
  histogram: {
    bargap: 0.05,
  },
  candlestick: {
    xaxis: { rangeslider: { visible: false } },
  },
  ohlc: {
    xaxis: { rangeslider: { visible: false } },
  },
};

export function getDefaultLayout(chartType: string): Partial<Layout> {
  return {
    ...defaultLayout['common'],
    ...(defaultLayout[chartType] || {}),
  };
}

export function updateDefaultLayout(chartType: string, newLayout: Partial<Layout>): void {
  if (chartType === 'common') {
    defaultLayout['common'] = { ...defaultLayout['common'], ...newLayout };
  } else if (chartType in defaultLayout) {
    defaultLayout[chartType] = { ...defaultLayout[chartType], ...newLayout };
  } else {
    defaultLayout[chartType] = newLayout;
  }
}

export function getAllChartTypes(): string[] {
  return Object.keys(defaultLayout).filter((key) => key !== 'common');
}
