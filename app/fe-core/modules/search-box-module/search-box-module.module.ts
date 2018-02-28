import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, ElementRef, Renderer} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GlobalSettings} from "../../../global/global-settings";
import {VerticalGlobalFunctions} from "../../../global/vertical-global-functions";

export interface SearchModuleInterface {
    category: number;
    searchModTitle: string;
    searchSubText: string;
    searchPlaceHolderText: string;
    searchBackground: string;
    searchScopeDropdown?: Array<{
      key: string,
      value: string,
    }>
}

@Component({
  selector: 'search-box-module',
  templateUrl: './app/fe-core/modules/search-box-module/search-box-module.module.html'
})

export class SearchBoxModule {
  @Input() scope: string;
  @Input() category: string;
  @Input() searchData: SearchModuleInterface;
  @Output() scopeEmit = new EventEmitter();
  @Output() userInput = new EventEmitter();
  fullSearchUrl: string;

  constructor(private activeRoute: ActivatedRoute, private router: Router, private render: Renderer) { }

  onKey(e: any) {
    this.userInput.emit(e);
  }


  selectedSport(e) {
    e = e.toLowerCase();
    this.scope = e;
    this.scopeEmit.emit(e);
    //this.router.navigate(['/deep-dive',this.category, e]);
  }
}
