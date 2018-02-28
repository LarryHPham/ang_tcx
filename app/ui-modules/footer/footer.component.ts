import {Component, OnInit, Input} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";

@Component({
    selector: 'footer-component',
    templateUrl: './app/ui-modules/footer/footer.component.html',
})
export class FooterComponent implements OnInit {
    @Input() partner: string;
    pageName: string;
    currentUrl: string = window.location.href;
    _siteTwitterUrl: string = GlobalSettings.getVerticalTwitter();
    _siteFacebookUrl: string = GlobalSettings.getVerticalFB();
    au: string = "About Us";
    service: string = "Terms of Service";
    privacy: string = "Privacy Policy";
    logoUrl: string = 'app/public/TCX_Logo_Outlined_White.svg';
    copyRight: string;
    loadData(partner: string) {
      var checkPartner = GlobalSettings.getHomeInfo().isPartner;
      if(!partner && !checkPartner) {
          this.pageName = GlobalSettings.getBaseTitle();
      } else {
          this.pageName = GlobalSettings.getBasePartnerTitle();
      }
    }
    ngOnInit() {
        this.copyRight = "Copyright " + GlobalSettings.getEstYear() + " TCX. Inc."
        this.loadData(this.partner);
    }
}
