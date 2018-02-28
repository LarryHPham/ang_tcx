import { Component, Input, OnChanges } from "@angular/core";
import { Gradient } from '../../../../global/global-gradient';

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/fe-core/components/articles/article-schedule/article-schedule.component.html'
})

export class ArticleScheduleComponent implements OnChanges {
    @Input() articleData:any;
    @Input() awayData:any;
    @Input() homeData:any;
    awayHex:string;
    defaultGradient:string;
    homeHex:string;
    gradient:Object;

    ngOnChanges() {
        if (typeof this.homeData != 'undefined' && typeof this.awayData != 'undefined') {
            this.awayHex = this.awayData[0].awayHex;
            this.homeHex = this.homeData[0].homeHex;
            var fullGradient = Gradient.getGradientStyles([this.awayHex, this.homeHex], .75);
            if (fullGradient) {
                this.gradient = fullGradient;
            }
            else {
                this.defaultGradient = 'default-gradient';
            }
        }
    }
}
