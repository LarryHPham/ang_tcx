import {Component, OnInit, Input} from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import {GlobalSettings} from '../../../../global/global-settings';
@Component({
    selector: 'billboard-component',
    templateUrl: './app/fe-core/components/articles/billboard/billboard.component.html'
})

export class BillboardComponent implements OnInit{
    dangerousBillBoardUrl:string;
    safeBillBoardUrl:SafeResourceUrl;
    @Input() partnerId;
    @Input() scope;
    @Input() teamId;
    constructor(private _sanitizer:DomSanitizer) {
    }

    ngOnInit() {
      let tdlScope = this.scope == 'nfl' ? "nfl": 'ncaaf';
        if (this.partnerId == null) {
            this.dangerousBillBoardUrl = GlobalSettings.widgetUrl()+"/widgets/sports/tdl_billboard.html?%7B%22team%22%3A%22" + this.teamId + "%22%2C%22remn%22%3A%22true%22%2C%22scope%22%3A%22" + tdlScope + "%22%7D";
        } else {
            this.dangerousBillBoardUrl = GlobalSettings.widgetUrl()+"/widgets/sports/tdl_billboard.html?%7B%22team%22%3A%22" + this.teamId + "%22%2C%22remn%22%3A%22false%22%2C%22dom%22%3A%22" + this.partnerId + "%22%2C%22scope%22%3A%22" + tdlScope + "%22%7D";
        }
        this.safeBillBoardUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.dangerousBillBoardUrl);
    }
}
