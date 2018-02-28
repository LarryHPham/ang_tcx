import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {GlobalSettings} from '../global/global-settings';
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";

@Injectable()
export class HeaderLinksService {
  static createMenu(){
    var partner = GlobalSettings.storedPartnerId();
    let topRoute = VerticalGlobalFunctions.getWhiteLabel();
    var menuData = [{
        menuTitle: "SPORTS",
        url: topRoute + '/sports'
      },
      {
        menuTitle: "ENTERTAINMENT",
        url: topRoute + '/entertainment'
      },
      {
        menuTitle: "BUSINESS",
        url: topRoute + '/business'
      },
      {
        menuTitle: "REAL ESTATE",
        url: topRoute + '/real--estate'
      }
      // {
      //   menuTitle: "WEATHER",
      //   url: topRoute + '/weather'
      // }
    ];

    return menuData;
  }
}
