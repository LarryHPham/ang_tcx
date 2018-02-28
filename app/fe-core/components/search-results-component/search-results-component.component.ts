import {Component, Input} from "@angular/core";
import {SyndicateArticleData} from "../../interfaces/syndicate-article.data";
@Component({
    selector:"search-results-component",
    templateUrl:'./app/fe-core/components/search-results-component/search-results-component.component.html',
})
export class SearchResultsComponent{
 @Input() singleArticleData:SyndicateArticleData;
}
