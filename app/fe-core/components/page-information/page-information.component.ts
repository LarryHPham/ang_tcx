import { Component, Input } from '@angular/core';

export interface infoData {
  title: string;
  lastUpdated: string;
  paragraph: Array<subInfoData>;
}
export interface subInfoData {
  subHeader: string;
  info: Array<string>;
}

export interface socialMedia {
  type: string;
  url: string;
  target: string;
  iconClass: string;
}

declare var stButtons: any;

@Component({
  selector: 'information-component',
  templateUrl: './app/fe-core/components/page-information/page-information.component.html',
})

export class InfoComponent{
  @Input() infoData: infoData;
  @Input() socialMedia: Array<socialMedia>;

  public locateShareThis = function(){
    stButtons.locateElements();
  };
}
