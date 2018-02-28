import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './global.ngmodule';
import { SyndicatedArticlePage } from "../webpages/syndicated-article-page/syndicated-article-page";
import {SyndicateArticleService} from "../services/syndicate-article.service";
import {DisqusComponent} from "../fe-core/components/disqus/disqus.component";
import {routing} from "../app.routing";
import {TrendingComponent} from "../fe-core/components/articles/trending/trending.component";
@NgModule({
    imports:[
        GlobalModule,
        routing,
    ],
    declarations:[
        SyndicatedArticlePage, DisqusComponent, TrendingComponent
    ],
    exports:[],
    providers: [SyndicateArticleService]
})

export class SyndicatedArticleNgModule{}
