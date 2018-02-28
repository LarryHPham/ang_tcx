import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//interfaces
import { ModuleHeader, ModuleHeaderData } from '../../components/module-header/module-header.component';

@Component({
    selector: 'schedules',
    templateUrl: './app/fe-core/modules/schedules/schedules.module.html'
})

export class SchedulesModule{
    @Input() data;
    @Input() profHeader;
    @Input() error;
    @Input() footerParams: any;
    @Input() filter1;
    @Input() filter2;
    @Input() dropdownKey1: string;
    @Input() dropdownKey2: string;
    @Input() storedPartnerParam: string;

    @Output("tabSelected") tabSelectedListener = new EventEmitter();
    @Output() selectedKeyFilter = new EventEmitter();

    public teamID: string;
    footerData:any;
    tabData: any;
    tabDisplay:any ;
    partnerIdParam: string;
    modHeadData: ModuleHeaderData;

    constructor(
      private _router:Router,
      private activateRoute: ActivatedRoute
    ){}

    toLowerKebab(str:string):string {
        str = str.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[\.,']/g, '');
        return str;
    }



    getFooter(tabDisplay?){
      this.modHeadData = {
        moduleTitle: "Weekly Schedules <span class='mod-info'>- " + this.profHeader.profileName + "</span>",
        hasIcon: false,
        iconClass: '',
      }
      var url;
      var params = this.footerParams;
      var matches = this.data.tabs.filter(tab => tab.display == this.tabDisplay);
      matches = matches.length > 0 ? matches[0].data : 'pregame';
      this.partnerIdParam = this.storedPartnerParam ? '/'+this.storedPartnerParam : '/';

      if(this.dropdownKey1 == null){
        this.dropdownKey1 = new Date().getFullYear().toString();
      }
      var year = this.dropdownKey1;

      //generate the route for the footer url
      if (params == undefined) {
        this.footerData = null;
      }
      else {
        url = [this.partnerIdParam, params.scope,'schedules', params.teamName];
        if(params.teamID != null){
          url.push(params.teamID);
        }
        url.push(year, params.tab, params.pageNum);

        this.footerData = {
          infoDesc: 'Want to see the full season schedule?',
          text: 'VIEW SCHEDULE',
          url: url
        };
      }
    } //getFooter



    ngOnChanges(){
      if(typeof this.data != 'undefined'){
          this.tabData = this.data.tabs;
      }
      if(this.filter1 != null){
        if(this.filter1.length > 0 && this.dropdownKey1 == null){
          this.dropdownKey1 = this.filter1[0].key;
        }
      }
      if(this.filter2 != null){
        if(this.filter2.length > 0 && this.dropdownKey2 == null){
          this.dropdownKey2 = this.filter2[0].key;
        }
      }
      if(this.footerData){
        if(this.dropdownKey1 == null){
          this.dropdownKey1 = new Date().getFullYear().toString();
        }
      }
      this.getFooter();
    } //ngOnChanges



    filterSelected(event){
      this.selectedKeyFilter.next(event);
    } //filterSelected



    tabSelected(tab) {
      this.tabDisplay = tab;
      this.getFooter(tab);
      this.tabSelectedListener.next(tab);
    } //tabSelected
}
