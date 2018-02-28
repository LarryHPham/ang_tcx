import {Component, Input} from '@angular/core';

@Component({
    selector: 'sidekick-wrapper',
    templateUrl: './app/fe-core/components/sidekick-wrapper/sidekick-wrapper.component.html'
})

export class SidekickWrapper {
  @Input() category: string;
  @Input() subCategory: string;
}
