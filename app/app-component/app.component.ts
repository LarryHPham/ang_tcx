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
    this._activatedRoute.params.subscribe(
        (params:any) => {
            //function that grabs the designated location needed for the client and if a partnerID is sent through then it will also set the partnerID and partnerScript for their Header
            GlobalSettings.storedPartnerId(params.partner_id);
            this.partnerID = params.partner_id;

            this._geoLocation.grabLocation(params.partner_id).subscribe(res => {
              if(res.partner_id){
                GlobalSettings.storedPartnerId(res.partner_id);
                this.partnerID = res.partner_id;
              }
              if(res.partner_script){
                this.partnerScript = res.partner_script;
              }
            })
        }
    );
  }
}
