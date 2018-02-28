import { Component, Input } from '@angular/core';

export interface ComparisonLegendInput {
    legendTitle: Array<{
        text: string,
        class?: string
    }>;
    legendValues: Array<{
       title: string,
       color: string
    }>;
}

@Component({
    selector: 'comparison-legend',
    templateUrl: './app/fe-core/components/comparison-legend/comparison-legend.component.html'
})

export class ComparisonLegend{
    @Input() comparisonLegendInput: ComparisonLegendInput;
}
