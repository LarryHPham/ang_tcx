/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from "rxjs/Observable";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";

export interface geoLocate {
    partner_id?: string;
    partner_script?: string;
    state?: string;
    city?: string;
    zipcode?: string;
}

@Injectable()

export class GeoLocation{
    geoData: geoLocate;

    geoObservable: Observable<any>

    constructor(public http: Http) { }


    getDomainApi(partner_id){
      var callURL = partner_id && typeof partner_id != 'undefined' ? GlobalSettings.getDomainAPI(partner_id) : null;
      // console.log("callURL", callURL);
      return this.http.get(callURL, {})
      .map(res=>res.json())
      .map(data=>{
        // console.log("DATA", data);
        return data;
      })
      .share();
    }

    //api to get geo location
    getGeoLocation() {
        var getGeoLocation = GlobalSettings.getGeoLocation() + '/getlocation/2';
        //  var getGeoLocation = GlobalSettings.getGeoLocation() + '/listhuv/?action=get_remote_addr2';
        if(!this.geoData){
          this.geoData = {};
          this.geoData['state'] = "KS";
          this.geoData['city'] = "Wichita";
          this.geoData['zipcode'] = "67260";
        }
        return new Observable(observer => {
            observer.next(this.geoData);
            observer.complete();
        });
        // return this.http.get(getGeoLocation)
        //     .map(res => res.json())
        //     .map(
        //     data => {
        //         data[0].state = data[0].state == null ? "us" : data[0].state;
        //         let state = data[0].state.toLowerCase();
        //         let city = data[0].city.replace(/ /g, "%20");
        //         let zipcode = data[0].zipcode;
        //         if (this.geoData == null) {
        //             this.geoData = {};
        //         }
        //         this.geoData['state'] = state;
        //         this.geoData['city'] = city;
        //         this.geoData['zipcode'] = zipcode;
        //         return this.geoData;
        //     })
        //     .share()
        //     .catch((error:any) => {
        //         return Observable.throw(new Error(error.status));
        //     });
    };

    grabLocation(partnerID?: string) {
        if (this.geoData) {
            return new Observable(observer => {
                observer.next(this.geoData);
                observer.complete();
            });
        } else if (this.geoObservable) {
            return this.geoObservable;
        } else {
            this.geoObservable = this.getGeoLocation();
            return this.geoObservable;
        }
    };
}
