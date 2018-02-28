import {Component, OnInit, HostListener, Renderer} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";
import {SeoService} from "../../global/seo.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'terms-of-service',
  templateUrl: 'app/webpages/terms-of-service/terms-of-service.html',
})

export class TermsOfService implements OnInit{
  aboutUsData: any;

  currentUrl: string = window.location.href;

  socialMedia:Array<any> = GlobalSettings.getSocialMedia(this.currentUrl);

  scrollTopPrev:number = 0;

  constructor(private _render:Renderer, private _seo:SeoService, private _activatedRoute:ActivatedRoute, private _router:Router){
      window.scrollTo(0, 0);
  }
  goTo(location: string): void {
      window.location.hash = location;
  }
  ngOnInit(){
    this.aboutUsData = {
      title: "Terms of Service",
      lastUpdated: "Last Updated On: Wednesday, Nov. 02, 2016",
      paragraph: null

    }
    this.addMetaTags();
  }

  private addMetaTags(){
    var title = 'Terms Of Service'
    this._seo.removeMetaTags();
    let metaDesc = GlobalSettings.getPageTitle('Terms Of Service');
    let link = window.location.href;
    this._seo.setCanonicalLink(this._activatedRoute.params,this._router);
    this._seo.setOgTitle('Terms Of Service');
    this._seo.setOgDesc(metaDesc);
    this._seo.setOgType('Website');
    this._seo.setOgUrl(link);
    this._seo.setOgImage('/app/public/mainLogo.png');
    this._seo.setTitle(title);
    this._seo.setMetaDescription(metaDesc);
    this._seo.setMetaRobots('INDEX, NOFOLLOW');
    this._seo.setPageTitle(title);
    this._seo.setPageType('Terms of service page');
      this._seo.setPageUrl(link);
      this._seo.setPageDescription(metaDesc);

  }
}
