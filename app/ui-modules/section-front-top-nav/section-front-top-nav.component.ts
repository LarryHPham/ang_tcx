import {Component, Input, OnInit} from '@angular/core';
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";


@Component({
    selector: 'section-front-top-nav',
    templateUrl: './app/ui-modules/section-front-top-nav/section-front-top-nav.component.html'
})

export class SectionFrontTopNav{
  @Input() scope: string;
  @Input() topScope: string;
  @Input() scopeList:string;
  @Input() pageScope: string;
  pageLink:any;
  constructor(){
    this.pageLink = VerticalGlobalFunctions.getWhiteLabel();
  }
}
