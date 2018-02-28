import { Component, Input } from '@angular/core';
import { ArticleStackData } from "../../interfaces/deep-dive.data";

@Component({
  selector: 'article-stacktop-component',
  templateUrl: './app/fe-core/components/article-stacktop/article-stacktop.component.html',
})

export class ArticleStacktopComponent{
  @Input() stackTopData: Array<ArticleStackData>;
  @Input() imgResize: number;
}
