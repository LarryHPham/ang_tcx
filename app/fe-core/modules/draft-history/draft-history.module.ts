import { Component, Output, EventEmitter, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { IProfileData } from "../profile-header/profile-header.module";

import { DetailListInput } from '../../components/detailed-list-item/detailed-list-item.component';

@Component({
    selector: 'draft-history-module',
    templateUrl: './app/fe-core/modules/draft-history/draft-history.module.html'
})

export class DraftHistoryModule implements OnInit {
  modHeadData: Object;
  partnerIdParam: string;

  @Input() footerData: any;
  @Input() profileData: IProfileData;
  @Input() storedPartnerParam: string;

  constructor() {}

  ngOnInit(){
    if ( this.profileData != null ) {
      this.displayData();
    }
  }

  displayData(){
    var pageRoute;
    if(this.profileData.profileType == 'team'){
      pageRoute = [this.storedPartnerParam, this.footerData.scope, 'draft-history', this.footerData.teamName, this.footerData.teamID];
    }else{
      pageRoute = [this.storedPartnerParam, this.footerData.scope, 'draft-history'];
    }

    this.footerData = {
      infoDesc: 'Want to see the full list?',
      text: 'VIEW THE FULL LIST',
      url: pageRoute
    };
    var title = '';
    if(this.profileData.profileType == 'league'){
      title = this.profileData['headerData'].leagueAbbreviatedName;
      this.profileData.profileName = "";
    }else{
      title = this.profileData['headerData'].teamMarket;
    }
    this.modHeadData = {
        moduleTitle: "Draft History",
        moduleIdentifier: " - " + title + " " + this.profileData.profileName,
        hasIcon: false,
        iconClass: '',
    }
  }
}
