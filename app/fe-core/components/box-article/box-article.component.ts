import {Component,OnInit,Input} from '@angular/core';
import {ImageData, RectangleImageData} from '../../components/images/image-data';
import {SanitizeHtml} from "../../pipes/safe.pipe";


export interface BoxArticleData {
  keyword: string;
  date: string;
  teaser: string;
  url: any;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'box-article-component',
  templateUrl: './app/fe-core/components/box-article/box-article.component.html',
})

export class BoxArticleComponent implements OnInit {
  @Input() boxArticleData: Array<BoxArticleData>;
  ngOnInit() {
  }//ngOnInit ends
}
