import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {GlobalSettings} from '../global/global-settings';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class HamburgerDeliveryService {
  static createMenu(){
    var topRoute = "";
    var partner = GlobalSettings.storedPartnerId();
    if (partner == null || partner == ""){
      topRoute = "/news-feed";
    }
    else {
      topRoute = "/" + partner + "/news";
    }
    var menuData = [{
        menuTitle: "Home",
        url: topRoute
      },
      {
        menuTitle: "Trending",
        url: topRoute + '/trending'
      },
      // {
      //   menuTitle: "Breaking",
      //   url: topRoute + '/breaking'
      // },
      {
        menuTitle: "Sports",
        url: topRoute + '/sports',
        nesterChildren: [
          {
            menuTitle: "NFL",
            url: topRoute + '/sports/nfl'
          },
          {
            menuTitle: "NCAAF",
            url: topRoute + '/sports/ncaaf'
          },
          {
            menuTitle: "NBA",
            url: topRoute + '/sports/nba'
          },
          {
            menuTitle: "NCAAM",
            url: topRoute + '/sports/ncaam'
          },
          {
            menuTitle: "MLB",
            url: topRoute + '/sports/mlb'
          }
          // {
          //   menuTitle: "NHL",
          //   url: topRoute + '/sports/nhl'
          // }
        ]
      },
      {
        menuTitle: "Business",
        url: topRoute + '/business'
      },
      {
        menuTitle: "Politics",
        url: topRoute + '/politics'
      },
      {
        menuTitle: "Entertainment",
        url: topRoute + '/entertainment',
        // nesterChildren: [
        //   {
        //     menuTitle: "Television",
        //     url: topRoute + '/entertainment/television'
        //   },
        //   {
        //     menuTitle: "Movies",
        //     url: topRoute + '/entertainment/movies'
        //   },
        //   {
        //     menuTitle: "Music",
        //     url: topRoute + '/entertainment/music'
        //   }
        // ]
      },
      {
        menuTitle: "Food",
        url: topRoute + '/food'
      },
      // {
      //   menuTitle: "Health",
      //   url: topRoute + '/health'
      // },
      {
        menuTitle: "Lifestyle",
        url: topRoute + '/lifestyle'
      },
      {
        menuTitle: "Real Estate",
        url: topRoute + '/real--estate'
      },
      {
        menuTitle: "Travel",
        url: topRoute + '/travel'
      }
      // {
      //   menuTitle: "Weather",
      //   url: topRoute + '/weather'
      // },
      // {
      //   menuTitle: "Automotive",
      //   url: topRoute + '/automotive'
      // }
    ];
    var menuInfo = [];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
