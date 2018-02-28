import {Component, OnInit, HostListener, Renderer} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";
import {SeoService} from "../../global/seo.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'about-us-page',
  templateUrl: 'app/webpages/aboutus/aboutus.html',
})

export class AboutUsPage implements OnInit{
  aboutUsData: any;

  currentUrl: string = window.location.href;

  socialMedia:Array<any> = GlobalSettings.getSocialMedia(this.currentUrl);

    scrollTopPrev:number = 0;
    constructor(private _render:Renderer, private _seo:SeoService, private _activatedRoute:ActivatedRoute, private _router:Router){
        window.scrollTo(0, 0);
    }

  ngOnInit(){
    this.aboutUsData = {
      title: "Want to learn more about TCX?",
      lastUpdated: "Last Updated On: Wednesday, Nov. 02, 2016",
      paragraph: [{
          subHeader: "What is TCX?",
          info: ['We created the Wichita, Kan.-based TCX in November, 2016 to combine personal and insightful human-generated articles with dynamic data-driven AI content.', 'Here at TCX, we have an appetite for digesting down big data to produce and organize content from across the world of journalism. We provide a unique range of content that keeps readers engaged and ready to dive deep into every corner of the newsroom. In addition to up-to-date articles written by humans, our AI-generated articles add to an infinitely-growing content library.']
      }]
    }
    this.addMetaTags();
  }

  private addMetaTags(){
    var title = this.aboutUsData.title;
    this._seo.removeMetaTags();
    let metaDesc = GlobalSettings.getPageTitle(this.aboutUsData.paragraph[0].info[0],'About Us');
    let link = window.location.href;
    this._seo.setCanonicalLink(this._activatedRoute.params,this._router);
   this._seo.setOgTitle(title);
    this._seo.setOgDesc(metaDesc);
    this._seo.setOgType('Website');
    this._seo.setOgUrl(link);
    this._seo.setOgImage('/app/public/mainLogo.png');
      this._seo.setTitle(title);
    this._seo.setMetaDescription(metaDesc);
    this._seo.setMetaRobots('INDEX, NOFOLLOW');
      this._seo.setPageTitle(title);
      this._seo.setPageType('About Us Page');
      this._seo.setPageUrl(link);
      this._seo.setPageDescription(metaDesc);
  }
}
