import {Component, Input}  from "@angular/core";

@Component({
    selector: 'article-main-component',
    templateUrl: './app/fe-core/components/articles/main-article/main-article.component.html'
})

export class ArticleMainComponent {
    @Input() articleUrl:any;
    @Input() eventType:any;
    @Input() keyword:any;
    @Input() league:any;
    @Input() mainContent:any;
    @Input() mainImage:any;
    @Input() mainTitle:any;
    @Input() timeStamp:any;
    @Input() titleFontSize:any;
}