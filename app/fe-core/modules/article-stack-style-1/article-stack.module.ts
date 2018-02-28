import { Component, Input } from '@angular/core';
import { ArticleStackData } from "../../interfaces/deep-dive.data";

@Component({
  selector: 'article-stack-1-module',
  templateUrl: './app/fe-core/modules/article-stack-style-1/article-stack.module.html',
})

export class ArticleStack1Module {
  @Input() stackTop: ArticleStackData;
  @Input() stackRow: Array<ArticleStackData>;
}
