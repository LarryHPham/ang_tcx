import {Component, Input, Renderer, ElementRef, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
@Component({
    selector:"search-filter",
    templateUrl:'./app/fe-core/modules/search-page-filter/search-page-filter.module.html'
})
export class SearchPageFilter{
    @Input() userInput:string;
    @Input() keywords:any;
    @Input() sortingFilter:any;
    @Output() emitFilterOption: EventEmitter<any> = new EventEmitter;
    @Output() emitSortOption:EventEmitter<any> = new EventEmitter;
    @Input() defaultSelectedKey:string;
    @Input() defaultSortKey:string;

    icon="caret-down";
    constructor(private router:Router, private _keywordRender:Renderer, private _keyRef:ElementRef){

    }

    keywordClick(e){
        this.emitFilterOption.emit(e);
    }
    sortingClick(e){
        this.emitSortOption.emit(e);
    }
}
