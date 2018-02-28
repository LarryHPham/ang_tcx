import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'article-content-component',
    templateUrl: './app/fe-core/components/articles/article-content/article-content.component.html'
})

export class ArticleContentComponent implements OnInit {
    @Input() articleData:any;
    @Input() articleType:any;
    @Input() articleSubType:any;
    @Input() imageLinks:any;
    @Input() partnerId:any;
    @Input() scope:any;
    @Input() teamId:any;
    isSmall:boolean = false;

    onResize(event) {
        this.isSmall = event.target.innerWidth < 640;
    }

    ngOnInit() {
        this.isSmall = window.innerWidth < 640;
    }
}
