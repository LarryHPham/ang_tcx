
import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
@Component({
    selector:"article-search-bar",
    templateUrl:"./app/fe-core/components/search-bar-article/search-bar-article.component.html"
})
export class ArticleSearchBar{
    @Input() searchTitle:string;
    @Input() searchSubTitle:string;
    @Input() scope;
    searchBoxBackground: string = '../app/public/photo-1473773508845-188df298d2d1.jpeg';
    public searchInput:FormGroup;
    public isSubmitted:boolean;




}