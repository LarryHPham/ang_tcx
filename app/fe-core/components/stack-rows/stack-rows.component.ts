import {Component, Input} from '@angular/core';
import { ArticleStackData } from "../../interfaces/deep-dive.data";

@Component({
  selector: 'stack-rows-component',
  templateUrl: './app/fe-core/components/stack-rows/stack-rows.component.html',
})

export class StackRowsComponent {
  @Input() stackRowData: Array<ArticleStackData>;
  @Input() imgResize: number;
}
