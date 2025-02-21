import { Component } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PlotlyChartComponent } from 'projects/wn-zorro/src/lib/components/chart/plotly-chart/plotly-chart.component';

@Component({
  selector: 'app-today-stats',
  imports: [PlotlyChartComponent, NzGridModule],
  templateUrl: './today-stats.component.html',
  styleUrl: './today-stats.component.less',
})
export class TodayStatsComponent {
  data: Plotly.Data[] = [
    // 折线图
    // {
    //   type: 'scatter',
    //   x: [1, 2, 3, 4],
    //   y: [10, 15, 13, 17],
    //   mode: 'lines+markers',
    //   name: '折线图',
    // },
    // 柱状图
    // {
    //   type: 'bar',
    //   x: ['A', 'B', 'C', 'D'],
    //   y: [20, 14, 23, 25],
    //   name: '柱状图',
    // },
    // 饼图
    {
      type: 'pie',
      values: [30, 20],
      labels: ['买入', '卖出'],
      name: '策略信号占比',
    },
    // 散点图
    // {
    //   type: 'scatter',
    //   x: [1, 2, 3, 4, 5],
    //   y: [1, 6, 3, 8, 4],
    //   mode: 'markers',
    //   marker: { size: 12 },
    //   name: '散点图',
    // },
  ];

  layout: Partial<Plotly.Layout> = {};
}
