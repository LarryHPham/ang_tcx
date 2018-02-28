import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";

//interfaces
import { DetailListInput } from '../../components/detailed-list-item/detailed-list-item.component';
import { ModuleHeaderData } from "../../components/module-header/module-header.component";
import { ProfileHeaderData } from "../profile-header/profile-header.module";

export interface ListOfListsData {
  listData: any;
}

@Component({
    selector: 'list-of-lists',
    templateUrl: './app/fe-core/modules/list-of-lists/list-of-lists.module.html'
})

export class ListOfListsModule {
  @Input() profileHeaderData : ProfileHeaderData;
  @Input() listOfListsData : ListOfListsData;
  @Input() profileType : string;
  @Input() teamId : string;
  @Input() playerId : string;
  @Input() scope : string;
  @Input() storedPartnerParam: string;

  moduleHeader: ModuleHeaderData;
  displayData: Array<any>;
  footerData: Object;
  partnerIdParam: string;

  constructor(private _router: Router) {
    this.footerData = {
      infoDesc:'Want to see more lists like the ones above?',
      btn:'',
      text:'VIEW MORE LISTS',
      url:['Error-page'], // Gets updated in ngOnChanges
      hasIcon: false
    }
  }

  ngOnChanges(event) {
    var origin = window.location.origin;
    if(typeof event.listOfListsData != 'undefined'){
      this.displayData = this.listOfListsData.listData;
    }

    this.moduleHeader = {
      moduleTitle: "Top Lists<span class='mod-info'> - " + this.profileHeaderData.profileName + "</span>",
      hasIcon: false,
      iconClass: "",
    }
  //  var type = this.listOfListsData[0]['target'];
  //  var routeName = type == "league" ? 'list-of-lists' : 'list-of-lists';
    var params = {
      limit:10,
      pageNum:1,
      id: ''
    };
    // localhost:3000/NFL/list-of-lists/:target/:id/:limit/:pagenum

    var id = this.teamId;
    if (this.profileType == 'league') {
      id = 'all';
    }
    if (this.profileType == 'player') {
      id = this.playerId;
    }

    this.partnerIdParam = this.storedPartnerParam ? '/'+this.storedPartnerParam : '/';

    this.footerData['url'] = [
      this.partnerIdParam,
      this.scope,
      'list-of-lists',
      this.profileType,
      id,
      params.limit,
      params.pageNum
    ];
  } //ngOnChnages

}
