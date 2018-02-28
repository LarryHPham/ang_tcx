import { Component, Input } from '@angular/core';
import { ArticleStackData } from "../../interfaces/deep-dive.data";

@Component({
  selector: 'article-block-component',
  templateUrl: './app/fe-core/components/article-block/article-block.component.html',
})

export class ArticleBlockComponent{
  @Input() articleBlockData: Array<ArticleStackData>;
  @Input() imgResize: number;
  @Input() bootstrapGrid: string;
}
