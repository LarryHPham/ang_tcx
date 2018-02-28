import { Component, Input, Output, EventEmitter } from '@angular/core';

//interfaces
import { CircleImageData } from '../images/image-data';
import { CircleImage } from '../images/circle-image/circle-image';

interface Link {
  route?: Array<any>;
  text: string;
  class?: string;
  active?: boolean;
}

export interface ComparisonTileInput {
    dropdownOneKey: string;
    dropdownTwoKey: string;
    imageConfig: CircleImageData;
    title: string;
    titleUrl: Array<any>;
    description: Array<Link | string>;
    //Currently accepts 4 data points
    data: Array<{data: string, key: string}>;
}

@Component({
    selector: 'comparison-tile',
    templateUrl: './app/fe-core/components/comparison-tile/comparison-tile.component.html'
})

export class ComparisonTile {
    @Input() comparisonTileInput: ComparisonTileInput;

    @Input() scope: string;

    @Input() dropdownList1: Array<{key: string, value: string}> = []

    @Input() dropdownList2: Array<{key: string, value: string}> = []

    @Output() dropdownSwitched = new EventEmitter();

    dropdownOneSwitched($event) {
        this.dropdownSwitched.next({
            dropdownIndex: 0,
            key: $event
        });
    }

    dropdownTwoSwitched($event) {
        this.dropdownSwitched.next({
            dropdownIndex: 1,
            key: $event
        });
    }
}
