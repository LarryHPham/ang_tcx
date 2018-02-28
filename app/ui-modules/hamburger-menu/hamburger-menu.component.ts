import {Component, Input, OnInit} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";
import {HamburgerDeliveryService} from '../../services/hamburger-delivery.service';

export interface MenuData{
  menuTitle: string,
  url: any,
}

@Component({
    selector: 'hamburger-menu-component',
    templateUrl: './app/ui-modules/hamburger-menu/hamburger-menu.component.html',
    providers: [HamburgerDeliveryService],
})

export class HamburgerMenuComponent implements OnInit {
  @Input() partnerID:string;
  @Input() scope: string;
  public menuData: any;
  public menuInfo: any;
  public refreshScroller: string;
  // public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv().toUpperCase();
  // public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv().toUpperCase();
  // public _collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv().toUpperCase();
  public isHome:any;
  constructor(){
    this.isHome = GlobalSettings.getHomeInfo().isHome;
  }
  onWindowResize(event) {
    this.refreshScroller += " ";
  }
  ngOnInit(){
    this.loadData();
    // this.scope = this.scope.toUpperCase();
    // if (this.scope == this._collegeDivisionAbbrv) {this.scope = this._collegeDivisionFullAbbrv;}
    // this.changeActiveLeague(this.scope);
  }//ngOnInit ends
  loadData() {
    var data = HamburgerDeliveryService.createMenu();
    this.menuData = data.menuData;
    this.menuInfo = data.menuInfo;
  }//loadData ends
  toggleNest(event) {
    if (event.target.src.includes("app/public/icon-+.svg")) { //if parent is currently closed
      //collapse all other open parents if any
      var parents = document.getElementById("hamburger-list").getElementsByClassName("nester-parent");
      for (var i = 0; i < parents.length; i++) {
        parents[i].classList.remove('open');
        var closeX = parents[i].getElementsByClassName("toggle-nest");
        for (var u = 0; u < closeX.length; u++) {
          closeX[u]['src'] = "app/public/icon-+.svg";
        }
      }

      //open this parent
      event.target.parentElement.classList.add('open');
      event.target.src = "app/public/icon-x.svg"
    }
    else { //if parent is currently open
      //close this parent
      event.target.parentElement.classList.remove('open');
      event.target.src = "app/public/icon-+.svg"
    }
    //change a data binding on scollable content to trigger the resize function
    this.refreshScroller += " ";
  }
}
