import {Component, AfterViewInit, Input, Inject, ElementRef} from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'line-chart',
  templateUrl: './app/fe-core/components/line-chart/line-chart.component.html'
})

export class LineChartComponent implements AfterViewInit {
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
        .find('.line-chart')
        .highcharts(this.options);
    }
  }
}
