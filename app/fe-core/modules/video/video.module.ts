import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {GlobalFunctions} from '../../../global/global-functions';

import {ModuleHeaderData} from '../../components/module-header/module-header.component'


@Component({
    selector: 'video-module',
    templateUrl: './app/fe-core/modules/video/video.module.html'
})

export class VideoModule implements OnInit,OnChanges {

  @Input() isProfilePage:boolean;
  @Input() videoData:any;
  @Input() profileHeader;
  @Input() firstVideo:string;
  @Input() geoLocation;

  embedUrl:SafeResourceUrl;
  modHeadData: ModuleHeaderData;
  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(){
    this.embedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.firstVideo);
  } //ngOnInit

  ngOnChanges(){
    if(this.isProfilePage){
      this.modHeadData = {
        moduleTitle: "Videos<span class='mod-info'> - "+this.profileHeader.profileName+" </span>",
        hasIcon: false,
        iconClass: '',
      }
    }
  } //ngOnChanges
}
