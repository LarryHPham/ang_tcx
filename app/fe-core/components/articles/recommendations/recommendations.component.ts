import {Component, Input} from '@angular/core';


@Component({
    selector: 'recommendations-component',
    templateUrl: './app/fe-core/components/articles/recommendations/recommendations.component.html'

})

export class RecommendationsComponent{
    @Input() randomHeadlines:any;
    @Input() images:any;
    @Input() isDeepDive:boolean = false;
}
