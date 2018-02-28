import { Component, Input } from '@angular/core';
import { ArticleStackData } from "../../interfaces/deep-dive.data";

@Component({
  selector: 'deep-dive-recommendation',
  templateUrl: './app/fe-core/modules/deep-dive-recommendation/deep-dive-recommendation.module.html',
})

export class DeepDiveRecommendation{
  @Input() recData: Array<ArticleStackData>;
}
