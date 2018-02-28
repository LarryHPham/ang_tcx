import { Component, AfterViewInit, Input, Inject, ElementRef } from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'bar-chart',
  templateUrl: './app/fe-core/components/bar-chart/bar-chart.component.html'
})

export class BarChartComponent implements AfterViewInit {
  @Input() options: any;

  private _elementRef: ElementRef;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    this._elementRef = elementRef;
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
    if ( this.options ) {
      jQuery(this._elementRef.nativeElement)
        .find('.daily-update-chart-wrapper')
        .highcharts(this.options);
    }
  }
}
