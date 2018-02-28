import {Component, Input, OnInit} from '@angular/core';

export interface gameAiImageConfig {
  hoverText: string;
  imageClass: string;
  imageUrl: string;
  urlRouteArray: string;
}
export interface gameAiArticle {
  report: string;
  date: string;
  eventId: string;
  eventType: any;
  imageConfig: gameAiImageConfig;
  keyword: string;
  teaser: string;
  title: string;
  url: Array<any>;
  urlRouteArray: string;
}

@Component({
    selector: 'game-article',
    templateUrl: './app/fe-core/components/game-article/game-article.component.html'
})

export class GameArticle implements OnInit{
    @Input() gameArticle:any;
    constructor() {}

    ngOnInit() {}
}
