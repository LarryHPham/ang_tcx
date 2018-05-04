import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";
import { GeoLocation } from "../global/global-service";
import {SeoService} from "../global/seo.service";

@Component({
  selector: 'my-app',
  templateUrl: 'app/app-component/app.component.html'
})
export class AppComponent {
  public partnerID:string;
  public partnerScript: string;
  private isCrawler: boolean = false;

  constructor(private _activatedRoute:ActivatedRoute, private _geoLocation: GeoLocation, private _seo: SeoService){
    this.isCrawler = this._seo.elasticSearchUserAgent();
  }
}
