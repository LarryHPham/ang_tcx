
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SearchPage} from "../webpages/search-page/search-page";
import {GlobalModule} from "./global.ngmodule";
import {SearchPageFilter} from "../fe-core/modules/search-page-filter/search-page-filter.module";
import {SearchArticleResults} from "../fe-core/modules/search-article-results/search-article-results.module";
import {SearchResultsComponent} from "../fe-core/components/search-results-component/search-results-component.component";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
@NgModule({
    imports:[GlobalModule],
    declarations:[SearchPage,SearchPageFilter,SearchArticleResults,SearchResultsComponent],
    /*exports:[],
    providers:[],*/
})
export class SearchPageNgModule{

}
