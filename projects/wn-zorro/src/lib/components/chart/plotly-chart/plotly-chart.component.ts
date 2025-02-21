import { Component, input, output, effect, OnInit, OnDestroy, ElementRef, viewChild, computed } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { getDefaultLayout } from './layout';

@Component({
  selector: 'wn-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  styleUrls: ['./plotly-chart.component.less'],
})
export class PlotlyChartComponent implements OnInit, OnDestroy {
  private chart = viewChild<ElementRef>('plotlyChart');

  data = input.required<Plotly.Data[]>();
  layout = input<Partial<Plotly.Layout>>({});
  config = input<Partial<Plotly.Config>>({});
  frames = input<Plotly.Frame[] | undefined>(undefined);

  chartType = computed(() => this.getChartType());
  plotlyClick = output<Plotly.PlotMouseEvent>();
  plotlyHover = output<Plotly.PlotMouseEvent>();
  plotlyUnhover = output<Plotly.PlotMouseEvent>();

  constructor() {
    effect(() => {
      if (this.chart()) {
        this.updateChart();
      }
    });
  }

  ngOnInit() {
    if (this.chart()) {
      this.createChart();
      this.setupEventListeners();
    }
  }

  ngOnDestroy() {
    if (this.chart()) {
      Plotly.purge(this.chart()!.nativeElement);
    }
  }

  private getChartType(): string {
    if (this.data().length === 0) {
      return 'scatter';
    }
    const firstTrace = this.data()[0];
    return firstTrace.type || 'scatter';
  }

  private createChart() {
    const mergedLayout = this.getMergedLayout();
    Plotly.newPlot(this.chart()!.nativeElement, this.data(), mergedLayout, this.config()).then(() => {
      this.setupEventListeners();
    });
  }

  private updateChart() {
    const mergedLayout = this.getMergedLayout();
    Plotly.react(this.chart()!.nativeElement, this.data(), mergedLayout, this.config());
  }

  private getMergedLayout(): Partial<Plotly.Layout> {
    const defaultLayout = getDefaultLayout(this.chartType());
    return { ...defaultLayout, ...this.layout() };
  }

  private setupEventListeners() {
    this.chart()!.nativeElement.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      this.plotlyClick.emit(event);
    });
    this.chart()!.nativeElement.on('plotly_hover', (event: Plotly.PlotMouseEvent) => {
      this.plotlyHover.emit(event);
    });
    this.chart()!.nativeElement.on('plotly_unhover', (event: Plotly.PlotMouseEvent) => {
      this.plotlyUnhover.emit(event);
    });
  }

  // 公共方法
  public relayout(layout: Partial<Plotly.Layout>) {
    if (this.chart()) {
      Plotly.relayout(this.chart()!.nativeElement, layout);
    }
  }

  public restyle(update: Partial<Plotly.Data>, indices?: number | number[]) {
    if (this.chart()) {
      Plotly.restyle(this.chart()!.nativeElement, update, indices);
    }
  }
}
