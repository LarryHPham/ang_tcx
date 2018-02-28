import {Component, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'trending-component',
    templateUrl: './app/fe-core/components/articles/trending/trending.component.html'
})

export class TrendingComponent {
    @Input() currentArticleId:string;
    @Input() eventType:string;
    @Input() geoLocation:string;
    @Input() scope:string;
    @Input() trendingData;
    @Input() showLoading:boolean;
    baseUrl: any;
    ngOnInit(){
      this.baseUrl = window.location.hostname;
    }
}
